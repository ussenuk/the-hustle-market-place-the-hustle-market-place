import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

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

  const handleBooking = (serviceId) => {
    // Handle booking logic
    console.log("Booking service with ID:", serviceId);
  };

  const handleRating = (serviceId, rating) => {
    // Handle rating logic
    console.log("Rating service with ID:", serviceId, "Rating:", rating);
  };

  const handleReview = (serviceId, review) => {
    // Handle review logic
    console.log("Reviewing service with ID:", serviceId, "Review:", review);
  };

  const handleMessage = (serviceId) => {
    // Handle message logic
    console.log("Messaging service provider for service with ID:", serviceId);
  };

  return (
    <div className="services-page-container">
      <h2>All Services</h2>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {services.map((service) => (
          <li key={service.service_id}>
            <h3>{service.service_title}</h3>
            <p>Category: {service.service_category}</p>
            <p>Posted by: {service.service_provider}</p>
            <button onClick={() => handleBooking(service.service_id)}>Book Now</button>
            <button onClick={() => handleMessaging(val.service_provider_id)}>Message</button>
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
            <button onClick={() => handleMessage(service.service_id)}>Message</button>
          </li>
        ))}
      </ul>
      <button onClick={handleNavigateHome}>Go to Home</button>
    </div>
  );
};

export default ServicesPage;