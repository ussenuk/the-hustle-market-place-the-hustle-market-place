import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
            <section style={{ display: "flex", justifyContent: "center" }}>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <h3>Available Services</h3>
                    </div>

                    <TableContainer
                        component={Paper}
                        style={{ boxShadow: "0px 13px 20px 0px #80808029", backgroundColor: "#f0f0f0" }}
                    >
                        <Table style={{ borderCollapse: "collapse", width: "100%" }} aria-label="simple table">
                            <TableHead>
                                <TableRow style={{ borderBottom: "1px solid #ddd" }}>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>Service Provider</TableCell>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">Service Title</TableCell>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">Service Category</TableCell>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">Pricing</TableCell>
                                    {/* Add more table headers as needed */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {serviceData.map((row) => (
                                    <TableRow key={row.service_id} style={{ borderBottom: "1px solid #ddd" }}>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} component="th" scope="row">
                                            {row.service_provider}
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.service_title}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.service_category}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.pricing}</TableCell>
                                        {/* Add more table cells as needed */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </section>
        </main>
    );
}

export default ServiceTable;


