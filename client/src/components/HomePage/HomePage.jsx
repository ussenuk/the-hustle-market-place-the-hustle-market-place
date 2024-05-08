import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";
import userImage from '../DashBoard/ServiceProviderDashboard/pages/teacher.png';
import { Box, Divider } from "@mui/material";
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
        const response = await fetch("http://127.0.0.1:5555/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          throw new Error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services. Please try again.");
      }
    };

    fetchServices();

    // Clear local storage on component mount (page load)
    localStorage.clear();
  }, []);

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleBooking = async (serviceId) => {
    try {
      // Prepare booking data
      const bookingData = {
        service_provider_id: serviceId,
        customer_id: getUserId(),
        time_service_provider_booked: new Date(bookingDateTime).toISOString().slice(0, 19).replace('T', ' ')
      };

      // Send booking request to the backend
      const response = await fetch('http://127.0.0.1:5555/add_booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      // Handle successful booking
      setBookedServiceId(serviceId); // Set the ID of the booked service
      console.log('Booking created successfully');
    } catch (error) {
      console.error('Error creating booking:', error.message);
      // Handle error
    }
  };

  const handleReview = async (serviceId) => {
    try {
      const reviewData = {
        stars_given: rating,
        booking_id: bookedServiceId, // Assuming bookedServiceId is the booking ID
        customer_id: getUserId(),
        comments: reviewComment
      };

      const response = await fetch('http://127.0.0.1:5555/add_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      console.log('Review added successfully');
      setReviewComment("")
    } catch (error) {
      console.error('Error adding review:', error.message);
      // Handle error
    }
  };

  const getUserId = () => {
    // Replace this with your function to get the user ID
    // For example, if you are using session storage:
    return sessionStorage.getItem("user_id");
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
                  bookingDateTime={bookingDateTime}
                  setBookingDateTime = {setBookingDateTime}
                  bookedServiceId={bookedServiceId}
                  setBookedServiceId={setBookedServiceId}
                  reviewComment={reviewComment}
                  setReviewComment={setReviewComment}
                  rating={rating} 
                setRating={setRating} 
                  />
                ))}
              </Box>
              </div>
        
      </div>
    );
    };

export default HomePage;







