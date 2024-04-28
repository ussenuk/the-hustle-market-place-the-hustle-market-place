import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddServiceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service_title: "",
    service_category: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5555/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/services");
      } else {
        throw new Error("Failed to add service");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      setError("Failed to add service. Please try again.");
    }
  };

  return (
    <div className="add-service-form-container">
      <h2>Add Service</h2>
      {error && <div className="error-message">{error}</div>}
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
        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default AddServiceForm;
