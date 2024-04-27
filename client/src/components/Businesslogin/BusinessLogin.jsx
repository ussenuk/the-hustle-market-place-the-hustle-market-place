

// client/src/components/BusinessLogin/BusinessLogin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./businesslogin.css";

const BusinessLogin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);
  
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

  useEffect(() => {
    const businessId = sessionStorage.getItem("business_id");
    if (businessId) {
      setIsLoggedIn(true);
      navigate("/");  // Assume '/dashboard' is the route for logged-in users
    }
  }, [navigate]);

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

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };

  return (
    <div className="business-access-container">
      {isLoggedIn ? (
        <div>
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


