// client/src/components/Userlogin/UserLogin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userlogin.css";

const UserAccess = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
    const payload = {
      ...formData,
    };

    try {
      const response = await axios.post(
        `http://localhost:5555/${endpoint}`,
        payload
      );

      if (response.data.user_id) {
        // User is logged in
        sessionStorage.setItem("user_id", response.data.user_id);
        setIsLoggedIn(true);
        setUsername(response.data.username); // Set the username
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

  return (
    <div className="user-access-container">
      {isLoggedIn ? (
        <div>
          <p>Welcome, {username}!</p> {/* Display username */}
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
