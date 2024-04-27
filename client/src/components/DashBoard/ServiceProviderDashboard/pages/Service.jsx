import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./servicetable.css";

function ServiceTable() {
    const [serviceData, setServiceData] = useState([]);

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/services');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setServiceData(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setServiceData([]); 
            }
        };
        fetchServiceData();
    }, []);

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>Available Services</h3>
                <TableContainer
                    component={Paper}
                    style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead classes={{ root: 'table-body' }}>
                            <TableRow classes={{ root: 'table-row' }}>
                                <TableCell>Service Provider</TableCell>
                                <TableCell align="left">Service Title</TableCell>
                                <TableCell align="left">Service Category</TableCell>
                                <TableCell align="left">Pricing</TableCell>
                                {/* Add more table headers as needed */}
                            </TableRow>
                        </TableHead>
                        <TableBody classes={{ root: 'table-body' }}>
                            {serviceData.map((row) => (
                                <TableRow classes={{ root: 'table-row' }}
                                    key={row.service_id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.service_provider}
                                    </TableCell>
                                    <TableCell align="left">{row.service_title}</TableCell>
                                    <TableCell align="left">{row.service_category}</TableCell>
                                    <TableCell align="left">{row.pricing}</TableCell>
                                    {/* Add more table cells as needed */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </main>
    );
}

export default ServiceTable;
