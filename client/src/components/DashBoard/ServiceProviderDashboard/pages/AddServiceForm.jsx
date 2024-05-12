import React, { useState } from "react";
import axios from "axios";

const AddServiceForm = () => {
  const [formData, setFormData] = useState({
    service_title: "",
    service_category: "",
    pricing: "",
    hours_available: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serviceProviderId = sessionStorage.getItem('business_id'); // Retrieve service provider ID from session storage
    if (!serviceProviderId) {
      setError("Please log in as a service provider.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5555/addservices", {
        ...formData,
      }, {
        headers: {
          "Content-Type": "application/json",
          "ServiceProviderId": serviceProviderId, // Pass service provider ID in headers
        },
      });
      if (response.status === 201) {
        setSuccessMessage("Service added successfully");
        setError(""); // Clear any previous errors
        console.log("Service added successfully");
        // Reset form data if needed
        setFormData({
          service_title: "",
          service_category: "",
          pricing: "",
          hours_available: "",
          location: ""
        });
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding service:", error);
      setError("Failed to add service. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <h2>Add Service</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="service_title"
          placeholder="Service Title"
          value={formData.service_title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="service_category"
          placeholder="Service Category"
          value={formData.service_category}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="pricing"
          placeholder="Pricing"
          value={formData.pricing}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="hours_available"
          placeholder="Hours Available"
          value={formData.hours_available}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
        />
        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default AddServiceForm;

