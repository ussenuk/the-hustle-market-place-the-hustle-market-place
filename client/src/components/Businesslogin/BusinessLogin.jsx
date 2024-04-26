// client/src/components/BusinessLogin/BusinessLogin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./businesslogin.css";

const BusinessLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    service_title: "",
    service_category: "",
    pricing: "",
    // hoursAvailable: "",
    location: "",
    // profilePicture: "",
    // videoDemoOfServiceOffered: "",
    // documents: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Basic validation checks
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (!isLogin) {
      // Additional checks for registration
      if (!formData.fullname) newErrors.fullname = "Full name is required";
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.service_title)
        newErrors.service_title = "Service title is required";
      if (!formData.service_category)
        newErrors.service_category = "Service category is required";
      if (!formData.pricing) newErrors.pricing = "Pricing is required";
      if (!formData.location) newErrors.location = "Location is required";
    //   if (!formData.hoursAvailable)
    //     newErrors.hoursAvailable = "Hours available are required"; 
    }

    return newErrors;
  };
const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  setErrors(newErrors);
  if (Object.keys(newErrors).length === 0) {
    const endpoint = isLogin ? "businesslogin" : "businessregister";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, pricing: parseInt(formData.pricing) };

    fetch(`http://localhost:5555/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to process the request");
      })
      .then((data) => {
        setSuccessMessage(
          `Successfully ${
            isLogin ? "logged in" : "registered"
          }. Welcome to Hutle.`
        );
        // Clear form fields
        setFormData({
          fullname: "",
          username: "",
          email: "",
          password: "",
          service_title: "",
          service_category: "",
          pricing: "",
          location: "",
        });
        navigate("/dashboard"); // Adjust the path as needed
      })
      .catch((error) => {
        console.error(
          `Error during ${isLogin ? "login" : "registration"}: `,
          error
        );
        setErrors({ form: error.message });
      });
  }
};


  return (
    <div className="business-access-container">
      <h2>{isLogin ? "Login" : "Registration"}</h2>
      <form onSubmit={handleSubmit}>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {!isLogin && (
          <>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleInputChange}
            />
            {errors.fullname && (
              <div className="error-message">{errors.fullname}</div>
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}

            <input
              type="text"
              name="service_title"
              placeholder="Service Title"
              value={formData.service_title}
              onChange={handleInputChange}
            />
            {errors.service_title && (
              <div className="error-message">{errors.service_title}</div>
            )}

            <input
              type="text"
              name="service_category"
              placeholder="Service Category"
              value={formData.service_category}
              onChange={handleInputChange}
            />
            {errors.service_category && (
              <div className="error-message">{errors.service_category}</div>
            )}

            <input
              type="number"
              name="pricing"
              placeholder="Pricing"
              value={formData.pricing}
              onChange={handleInputChange}
            />
            {errors.pricing && (
              <div className="error-message">{errors.pricing}</div>
            )}

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
            />
            {errors.location && (
              <div className="error-message">{errors.location}</div>
            )}
            {/* <input
              type="text"
              name="hoursAvailable"
              placeholder= "Hours Available (e.g., '9 AM to 5 PM')"
              value={formData.hoursAvailable}
              onChange={handleInputChange}
            />
            {errors.hoursAvailable && (
              <div className="error-message">{errors.hoursAvailable}</div>
            )} */}
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && (
          <div className="error-message">{errors.password}</div>
        )}

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need to register?" : "Already registered? Login here"}
        </button>
      </form>
    </div>
  );
};

export default BusinessLogin;
