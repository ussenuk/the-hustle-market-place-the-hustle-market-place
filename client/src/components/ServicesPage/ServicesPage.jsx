import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5555/services");
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

  return (
    <div className="services-page-container">
      <h2>All Services</h2>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <h3>{service.service_title}</h3>
            <p>Category: {service.service_category}</p>
            <p>Posted by: {service.service_provider_id}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleNavigateHome}>Go to Home</button>
    </div>
  );
};

export default ServicesPage;
