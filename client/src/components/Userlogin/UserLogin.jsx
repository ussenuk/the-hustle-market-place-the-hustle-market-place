

// client/src/components/Userlogin/UserLogin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userlogin.css";
import userImage from "../DashBoard/ServiceProviderDashboard/pages/user_prof.jpg"

const UserAccess = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    location: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "userregister" : "userlogin";
    const payload = { ...formData };

    if (isRegistering) {
      const { fullname, username, email, password, location } = formData;
      if (!fullname || !username || !email || !password || !location) {
        setError("Please fill all the required fields.");
        return;
      }
    }

    try {
      const response = await axios.post(
        `http://localhost:5555/${endpoint}`,
        payload
      );

      if (response.data.user_id) {
        sessionStorage.setItem("user_id", response.data.user_id);
        setIsLoggedIn(true);
        setUsername(response.data.username);
        navigate("/"); // Redirect user to the homepage or dashboard after login
      } else if (response.data.message && isRegistering) {
        alert("Registration successful, please log in.");
        setIsRegistering(false);
        setError("");
        setFormData({ ...formData, password: "" });
      } else {
        setError(response.data.error || "An unexpected error occurred");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };



  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5555/logout");
      sessionStorage.removeItem("user_id");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError(""); // Clear error messages when switching modes
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    // Retrieve value from Session storage
    
    // Make API call to fetch service providers
    fetch("http://localhost:5555/user_name")
      .then((response) => response.json())
      .then((data) => {
        // Find service provider with matching ID
        const User = data.find(
          (provider) => provider.id === parseInt(userId)
        );
        if (User) {
          setUserInfo(User);
        }
      })
      .catch((error) =>
        console.error("Error fetching service providers:", error)
      );
  }, []);

  return (
    <div className="user-access-container">
      {isLoggedIn ? (
        
        <div class="welcome-container">
        <img
              src={
                userImage ||
                "/src/components/DashBoard/ServiceProviderDashboard/pages/default-image.png"
              }
              alt="User"
            />
        <span>
        Welcome{" "}
        <span className="green-text">
          {userInfo.user}
        </span>
      </span>
          <button class="logout-button" onClick={handleLogout}>Logout</button>
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
                <input
                  type="text"
                  name="location"
                  className="input-field"
                  placeholder="Location"
                  value={formData.location}
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

export default UserAccess;
