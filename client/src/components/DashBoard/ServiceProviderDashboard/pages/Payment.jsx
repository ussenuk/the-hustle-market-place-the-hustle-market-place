import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function PaymentDetails() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/payments');
                if (!response.ok) {
                    throw new Error('Failed to fetch payment details');
                }
                const data = await response.json();
                setPayments(data);
            } catch (error) {
                console.error('Error fetching payment details:', error.message);
            }
        };
        fetchPayments();
    }, []);

    return (
        <main className='main-container'>
            <section style={{ display: "flex", justifyContent: "center" }}>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <h3>Payment Details</h3>
                    </div>

                    <TableContainer component={Paper} style={{ boxShadow: "0px 13px 20px 0px #80808029", backgroundColor: "#f0f0f0" }}>
                        <Table style={{ borderCollapse: "collapse", width: "100%" }} aria-label="simple table">
                            <TableHead>
                                <TableRow style={{ borderBottom: "1px solid #ddd" }}>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>Payment ID</TableCell>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">Status</TableCell>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">Option</TableCell>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">Booking ID</TableCell>
                                    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">Customer ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.map(payment => (
                                    <TableRow key={payment.id} style={{ borderBottom: "1px solid #ddd" }}>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>{payment.id}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{payment.payment_status}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{payment.payment_option}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{payment.booking_id}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{payment.customer_id}</TableCell>
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

export default PaymentDetails;
