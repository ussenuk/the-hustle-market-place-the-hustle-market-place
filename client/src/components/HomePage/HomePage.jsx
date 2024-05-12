import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";
import { Box } from "@mui/material";
import ServiceCard from "./ServiceCard";
import Footer from "../Footer/Footer";

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookedServiceId, setBookedServiceId] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [rating, setRating] = useState(0); 
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          setFilteredServices(data); // Initialize filtered services with all services
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
    try {
      // Check if user is logged in
      const userId = getUserId();
      if (!userId) {
        // Redirect to login page
        navigate("/userlogins");
        // Show error message
        setError("Please log in to book a service");
        return;
      }

  
      // Prepare booking data
      const bookingData = {
        service_provider_id: serviceId,
        customer_id: userId,
        time_service_provider_booked: new Date(bookingDateTime).toISOString().slice(0, 19).replace('T', ' ')
      };
  
      // Send booking request to the backend
      const response = await fetch('/add_booking', {
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
      setError(""); // Clear any previous error message
      console.log('Booking created successfully');
    } catch (error) {
      console.error('Error creating booking:', error.message);
      // Handle error
    }
  };


  const getUserId = () => {
    // Replace this with your function to get the user ID
    // For example, if you are using session storage:
    return sessionStorage.getItem("user_id");
  };

  // console.log(userId)
  const handleReview = async (serviceId) => {
    try {
      // Check if user is logged in
      const userId = getUserId();
      if (!userId) {
        // Redirect to login page
        navigate("/userlogins");
        // Show error message
        setError("Please log in to add a review");
        return;
      }
  
      const reviewData = {
        stars_given: rating,
        booking_id: serviceId, // Assuming bookedServiceId is the booking ID
        customer_id: userId,
        comments: reviewComment
      };
  
      const response = await fetch('/add_review', {
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
      setReviewComment("");
      setError(""); // Clear any previous error message
    } catch (error) {
      console.error('Error adding review:', error.message);
      // Handle error
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = services.filter(service =>
      service.service_title.toLowerCase().includes(searchTerm)
    );
    setFilteredServices(filtered);
  };

  const handlePayNow = (serviceId, price) => {
    navigate(`/payment?serviceId=${serviceId}&price=${price}`);
  };

  // const getUserId = () => {
  //   return sessionStorage.getItem('user_id');
  // };

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
        <input
          type="text"
          placeholder="Search services..."
          onChange={handleSearch}
        />
        {error && <div className="error-message">{error}</div>}
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {filteredServices.map((service) => (
            <ServiceCard 
              key={service.service_id} 
              service={service}
              handleReview={handleReview}
              handleBooking={() => handleBooking(service.service_id)} // Pass service ID to handleBooking
              bookingDateTime={bookingDateTime}
              handlePayNow={handlePayNow}
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
      </div>
      <Footer />
    </div>
  );
};

export default HomePage; 









