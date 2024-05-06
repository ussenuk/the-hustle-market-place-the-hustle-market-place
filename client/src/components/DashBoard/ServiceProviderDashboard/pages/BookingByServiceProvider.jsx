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
                const service_provider_id = sessionStorage.getItem('business_id'); // Replace with the actual service provider ID
                const response = await fetch(`http://127.0.0.1:5555/bookings/${service_provider_id}`);
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
        <main className='main-container'>
            <section style={{ display: "flex", justifyContent: "center" }}>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <h3>Bookings for This Service Provider</h3>
                    </div>
                    <TableContainer
                        component={Paper}
                        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                    >
                        <Table style={{ borderCollapse: "collapse", width: "100%" }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Service Provider</TableCell>
                                    <TableCell align="left">Customer</TableCell>
                                    <TableCell align="left">Booking Date</TableCell>
                                    <TableCell align="left">Payment Status</TableCell>
                                    <TableCell align="left">Service</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookingData.map((row) => (
                                    <TableRow
                                        key={row.booking_id}
                                        style={{ borderBottom: "1px solid #ddd" }}
                                    >
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} component="th" scope="row">
                                            {row.service_provider}
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.customer}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.time_service_provider_booked}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">
                                            <span className="status" style={makeStyle(row.payment_status)}>{row.payment_status}</span>
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.service_title}</TableCell>
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
