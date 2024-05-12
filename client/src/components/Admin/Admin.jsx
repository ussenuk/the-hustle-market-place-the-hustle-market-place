

// client/src/components/Admin/Admin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adminaccess.css";
import userImage from "../DashBoard/ServiceProviderDashboard/pages/teacher.png"


const AdminAccess = ({ isLoggedInAdmin, setIsLoggedInAdmin}) => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "adminregister" : "adminlogin";
    const payload = {
      ...formData,
    };

    try {
      const response = await axios.post(
        `/${endpoint}`,
        payload
      );

      if (response.data.admin_id) {
        // Admin is logged in
        sessionStorage.setItem("admin_id", response.data.admin_id);
        setIsLoggedInAdmin(true);
      } else if (response.data.message && isRegistering) {
        // Registration successful, prompt login
        alert("Registration successful, please log in.");
        setIsRegistering(false);
        setError("");
        setFormData({ ...formData, password: "" });
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
      await axios.get("/adminlogout");
      sessionStorage.removeItem("admin_id");
      setIsLoggedInAdmin(false);
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDashboardAccess = () => {
    navigate("/dashboard"); // Navigate to the "/dashboard" route
  };

  const [adminInfo, setAdminInfo] = useState({});
  useEffect(() => {
    // Retrieve value from Session storage
    const AdminId = sessionStorage.getItem('admin_id');

    // Make API call to fetch service providers
    fetch("/admin")
      .then(response => response.json())
      .then(data => {
        // Find service provider with matching ID
        const Admin = data.find(admin => admin.id === parseInt(AdminId));
        if (Admin) {
          setAdminInfo(Admin);
        }
      })
      .catch(error => console.error('Error fetching service providers:', error));
  }, []);

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };

  return (
    <div className="admin-access-container">
      {isLoggedInAdmin ? (
        <div>
        <div className="user-card">
        {/* Add the user image and name here */}
        <img src={userImage || '/src/components/DashBoard/ServiceProviderDashboard/pages/default-image.png'} alt="User" />
        <span>Welcome <span className="green-text">{adminInfo.admin}</span></span>
      </div>
          <button onClick={handleDashboardAccess}> Admin Dashboard Access</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>{isRegistering ? "Registration" : "Login"}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <input
                  type="text"
                  name="fullname"
                  className="input-field"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="username"
                  className="input-field"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </>
            )}
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="submit" className="submit-button">
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>
          <button onClick={switchMode} className="switch-button">
            {isRegistering ? "Switch to Login" : "Switch to Registration"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAccess;