import React, { useState, useEffect } from 'react';
import '../DashBoard.css'

function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState([]);

  useEffect(() => {
    fetch("/reviews")
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const handleDelete = (reviewId) => {
    setConfirmDeleteIds([...confirmDeleteIds, reviewId]);
  };

  const confirmDelete = async (reviewId) => {
    try {
      const response = await fetch(`/delete_review/${reviewId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Review deleted successfully');
        setReviews(reviews.filter((review) => review.review_id !== reviewId));
      } else if (response.status === 404) {
        throw new Error('Review not found');
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error.message);
    }
    setConfirmDeleteIds(confirmDeleteIds.filter((id) => id !== reviewId));
  };

  const cancelDelete = (reviewId) => {
    setConfirmDeleteIds(confirmDeleteIds.filter((id) => id !== reviewId));
  };

  return (
    <main className='main-container'>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <div style={{ textAlign: "center" }}>
            <h2>
              <strong>
                <u>LIST OF ALL REVIEWS</u>
              </strong>
            </h2>
            <p>Items found: {reviews.length}</p>
          </div>

          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Review ID</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Customer</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Stars Given</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Comments</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.review_id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{review.review_id}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{review.customer}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{review.stars_given}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{review.comments}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button onClick={() => handleDelete(review.review_id)}>Delete</button>
                    {confirmDeleteIds.includes(review.review_id) && (
                      <>
                        <button onClick={() => confirmDelete(review.review_id)}>Confirm</button>
                        <button onClick={() => cancelDelete(review.review_id)}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default ReviewsList;