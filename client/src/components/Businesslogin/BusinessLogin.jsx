import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./businesslogin.css";
import userImage from "../DashBoard/ServiceProviderDashboard/pages/teacher.png"

const BusinessLogin = ({isLoggedIn, setIsLoggedIn}) => {
  
  
  const [isRegistering, setIsRegistering] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    service_title: "",
    service_category: "",
    pricing: "",
    hours_available: "",
    location: "",
    
  });
  const [error, setError] = useState("");

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "businessregister" : "businesslogin";
    const payload = {
      ...formData,
    };

    try {
      const response = await axios.post(
        `http://localhost:5555/${endpoint}`,
        payload
      );
      if (response.data.business_id) {
        // User is logged in
        sessionStorage.setItem("business_id", response.data.business_id);
        setIsLoggedIn(true);
      } else if (response.data.message && isRegistering) {
        // Registration successful, prompt login
        alert("Registration successful, please log in."); // Optional: Use a more sophisticated notification system
        setIsRegistering(false); // Switch to login mode
        setError(""); // Clear any previous errors
        setFormData({ ...formData, password: "" }); // Clear password (and any other sensitive data)
      } else if (response.data.error) {
        // Handle errors
        setError(response.data.error);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5555/businesslogout");
      sessionStorage.removeItem("business_id");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDashboardAccess = () => {
    navigate("/dashboard"); // Navigate to the "/dashboard" route
  };


  const [serviceProviderInfo, setServiceProviderInfo] = useState({});
  useEffect(() => {
    // Retrieve value from Session storage
    const serviceProviderId = sessionStorage.getItem('business_id');

    // Make API call to fetch service providers
    fetch("http://localhost:5555/service_provider")
      .then(response => response.json())
      .then(data => {
        // Find service provider with matching ID
        const serviceProvider = data.find(provider => provider.id === parseInt(serviceProviderId));
        if (serviceProvider) {
          setServiceProviderInfo(serviceProvider);
        }
      })
      .catch(error => console.error('Error fetching service providers:', error));
  }, []);

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };

  return (
    <div className="business-access-container">
      {isLoggedIn ? (
        <div>
        <div className="user-card">
        {/* Add the user image and name here */}
        <img src={userImage || '/src/components/DashBoard/ServiceProviderDashboard/pages/default-image.png'} alt="User" />
        <span>Welcome <span className="green-text">{serviceProviderInfo.service_provider}</span></span>
      </div>
          <button onClick={handleDashboardAccess}> Dashboard Access</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>{isRegistering ? "Registration" : "Login"} </h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <input type="text" name="fullname" className="input-field" placeholder="Full Name" value={formData.fullname} onChange={handleInputChange} 
                />
                <input type="text" name="username" className="input-field" placeholder="Username" value={formData.username} onChange={handleInputChange} 
                />
                <input type="text" name="service_title" className="input-field" placeholder="Service Title" value={formData.service_title} onChange={handleInputChange} 
                />
                <input type="text" name="service_category" className="input-field" placeholder="Service Category" value={formData.service_category} onChange={handleInputChange} 
                />
                <input type="number" name="pricing" className="input-field" placeholder="Pricing" value={formData.pricing} onChange={handleInputChange} 
                />
                <input type="text" name="location" className="input-field" placeholder="Location" value={formData.location} onChange={handleInputChange} 
                />
                <input type="text" name="hours_available" className="input-field" placeholder="Hours Available (e.g., '8 AM to 5 PM')" value={formData.hours_available} onChange={handleInputChange} 
                />
               
          </>
        )}
        {/* Inputs for both registration and login */}
            <input type="email" name="email" className="input-field" placeholder="Email" value={formData.email} onChange={handleInputChange} />
            <input type="password" name="password" className="input-field" placeholder="Password" value={formData.password} onChange={handleInputChange} />
            <button type="submit">{isRegistering ? "Register" : "Login"}</button>
          </form>
          <button onClick={switchMode}>
            {isRegistering ? "Switch to Login" : "Switch to Registration"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessLogin;