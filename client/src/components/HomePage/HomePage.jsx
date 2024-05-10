import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [bookingDateTime, setBookingDateTime] = useState('');
  const [bookedServiceId, setBookedServiceId] = useState(null);

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
  }, []);

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleBooking = async (serviceId) => {
    try {
      const bookingData = {
        service_provider_id: serviceId,
        customer_id: getUserId(),
        time_service_provider_booked: new Date(bookingDateTime).toISOString().slice(0, 19).replace('T', ' '),
      };

      const response = await fetch('http://127.0.0.1:5555/add_booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setBookedServiceId(serviceId);
      console.log('Booking created successfully');
    } catch (error) {
      console.error('Error creating booking:', error.message);
    }
  };

  const handlePayNow = (serviceId, price) => {
    // Navigate to the payment page with serviceId and price as parameters
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
              <div className="booking-success-popup">
                {bookedServiceId === service.service_id && <p>Booking successful!</p>}
              </div>
              <button onClick={() => handleBooking(service.service_id)}>Book Now</button>
              <button onClick={() => handlePayNow(service.service_id, service.pricing)}>Pay Now</button>
            </li>
          ))}
        </ul>
        <button onClick={handleNavigateHome}>Go to Home</button>
      </div>
    </div>
  );
};

export default HomePage;
