import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./bookingtable.css";

export default function BasicTable() {
    const [bookingData, setBookingData] = useState([]);

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/booking');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setBookingData(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setBookingData([]); 
            }
        };
        fetchBookingData();
    }, []);

    const makeStyle = (status) => {
        if (status === 'Approved') {
            return {
                background: 'rgb(145 254 159 / 47%)',
                color: 'green',
            };
        } else if (status === 'Pending') {
            return {
                background: '#ffadad8f',
                color: 'red',
            };
        } else {
            return {
                background: '#59bfff',
                color: 'white',
            };
        }
    };

    return (
        <div className="Table">
            <h3>Recent Bookings</h3>
            <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead classes={{ root: 'table-body' }}>
                        <TableRow classes={{ root: 'table-row' }}>
                            <TableCell>Service Provider</TableCell>
                            <TableCell align="left">Customer</TableCell>
                            <TableCell align="left">Booking Date</TableCell>
                            <TableCell align="left">Payment Status</TableCell>
                            <TableCell align="left">Service</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody classes={{ root: 'table-body' }}>
                        {bookingData.map((row) => (
                            <TableRow classes={{ root: 'table-row' }}
                                key={row.booking_id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.service_provider}
                                </TableCell>
                                <TableCell align="left">{row.customer}</TableCell>
                                <TableCell align="left">{row.time_service_provider_booked}</TableCell>
                                <TableCell align="left">
                                    <span className="status" style={makeStyle(row.payment_status)}>{row.payment_status}</span>
                                </TableCell>
                                <TableCell align="left" className="Details">{row.service_title}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
