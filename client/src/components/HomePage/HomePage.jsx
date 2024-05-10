import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";
import { Box } from "@mui/material";
import ServiceCard from "./ServiceCard";

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookedServiceId, setBookedServiceId] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          throw new Error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to fetch services. Please try again.');
      }
    };

    fetchServices();
    localStorage.clear();
  }, []);

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleBooking = async (serviceId) => {
    // Implementation remains the same as your previous
  };

  const handleReview = async (serviceId) => {
    // Implementation remains the same as your previous
  };

  const handlePayNow = (serviceId, price) => {
    navigate(`/payment?serviceId=${serviceId}&price=${price}`);
  };

  const getUserId = () => {
    return sessionStorage.getItem('user_id');
  };

  return (
    <div className="homepage">
      <h1>Welcome to Hutle!</h1>
      <p>Your trusted platform connecting businesses and consumers seamlessly.</p>
      <div className="homepage-details">
        <p>
          At Hutle, we revolutionize how businesses interact with their customers. Join us to explore endless possibilities, whether you are a business looking to grow or a consumer seeking quality services.
        </p>
        <p>Sign Up Now!</p>
      </div>
      <div className="services-page-container">
        <h2>All Services</h2>
        {error && <div className="error-message">{error}</div>}
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {services.map((service) => (
            <ServiceCard 
              key={service.service_id} 
              service={service}
              handleReview={handleReview}
              handleBooking={handleBooking}
              handlePayNow={handlePayNow}
              bookingDateTime={bookingDateTime}
              setBookingDateTime={setBookingDateTime}
              bookedServiceId={bookedServiceId}
              setBookedServiceId={setBookedServiceId}
              reviewComment={reviewComment}
              setReviewComment={setReviewComment}
              rating={rating} 
              setRating={setRating}
              serviceId={service.service_id} 
            />
          ))}
        </Box>
        <button onClick={handleNavigateHome}>Go to Home</button>
      </div>
    </div>
  );
};

export default HomePage;
