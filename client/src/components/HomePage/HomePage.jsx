import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookedServiceId, setBookedServiceId] = useState(null); // State to store the ID of the booked service

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

  const handlePayNow = () => {
    // Handle payment logic here
    console.log("Payment logic goes here");
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
        <ul>
          {services.map((service) => (
            <li key={service.service_id}>
              <h3>{service.service_title}</h3>
              <p>Category: {service.service_category}</p>
              <p>Posted by: {service.service_provider}</p>
              <p>Location: {service.location}</p>
              <p>Available Hours: {service.hours_available}</p>
              <p>Pricing: {service.pricing}</p>
              <input
                type="datetime-local"
                value={bookingDateTime}
                onChange={(e) => setBookingDateTime(e.target.value)}
              />
              {bookedServiceId === service.service_id && (
                <div className="booking-success-popup">
                  <p>You have successfully booked the service.</p>
                  <button onClick={handlePayNow}>Pay Now</button>
                </div>
              )}
              <button onClick={() => handleBooking(service.service_id)}>Book Now</button>
              <button onClick={() => handleMessage(service.service_id)}>Message</button>
              <select onChange={(e) => handleRating(service.service_id, e.target.value)}>
                <option value="">Rate this service</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <textarea
                rows="3"
                placeholder="Leave a review"
                onChange={(e) => handleReview(service.service_id, e.target.value)}
              ></textarea>
            </li>
          ))}
        </ul>
        <button onClick={handleNavigateHome}>Go to Home</button>
      </div>
    </div>
  );
};

export default HomePage;

