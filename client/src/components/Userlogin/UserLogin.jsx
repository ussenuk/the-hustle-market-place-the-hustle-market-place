

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userlogin.css";

const UserAccess = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    location: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "userlogin" : "userregister";
    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          location: formData.location,
        };

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
        throw new Error(isLogin ? "Failed to login" : "Failed to register");
      })
      .then((data) => {
        navigate("/");
      })
      .catch((error) => {
        console.error(
          `Error during ${isLogin ? "login" : "registration"}: `,
          error
        );
        setError(
          isLogin
            ? "Invalid email or password."
            : "Failed to register. Please try again."
        );
      });
  };

  return (
    <div className="user-access-container">
      <h2>{isLogin ? "Login" : "Registration"}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need to register?" : "Already registered? Login"}
        </button>
      </form>
    </div>
  );
};

export default UserAccess;

