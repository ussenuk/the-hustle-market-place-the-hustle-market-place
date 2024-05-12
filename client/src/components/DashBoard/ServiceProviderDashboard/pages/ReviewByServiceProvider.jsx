import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./bookingtable.css"; // Update the CSS file name if needed

export default function ReviewTable() {
    const [reviewsData, setReviewsData] = useState([]);

    useEffect(() => {
        const fetchReviewsData = async () => {
            try {
                const service_provider_id = sessionStorage.getItem('business_id'); // Replace with the actual service provider ID
                const response = await fetch(`/reviews/${service_provider_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setReviewsData(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setReviewsData([]); 
            }
        };
        fetchReviewsData();
    }, []);

    return (
        <main className='main-container'>
            <section style={{ display: "flex", justifyContent: "center" }}>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <h3>Anonymous Reviews for This Service Provider</h3>
                    </div>
                    <TableContainer
                        component={Paper}
                        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                    >
                        <Table style={{ borderCollapse: "collapse", width: "100%" }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Customer ID</TableCell>
                                    <TableCell align="left">Stars Given</TableCell>
                                    <TableCell align="left">Comments</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviewsData.map((row) => (
                                    <TableRow
                                        key={row.review_id}
                                        style={{ borderBottom: "1px solid #ddd" }}
                                    >
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} component="th" scope="row">
                                            {row.customer}
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.stars_given}</TableCell>
                                        <TableCell style={{ border: "1px solid #ddd", padding: "8px" }} align="left">{row.comments}</TableCell>
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
