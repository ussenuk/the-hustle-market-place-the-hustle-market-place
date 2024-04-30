

// client/src/components/NavBar/Navbar.jsx

import React from "react";

import { Link } from "react-router-dom";

import "./navbar.css";

const Navigation = () => {
  return (
    <div className="nav" id="nav">
      <Link to="/">Home</Link>
      {/* <Link to="/services">Services</Link> */}
      {/* <Link to="/add-service">Add Service</Link> */}
      <Link to="/about">About Us</Link>
      {/* <Link to="/feedback">Feedback</Link> */}
      <Link to="/businesslogin">Business Login/Register</Link>
      <Link to="/userlogin">Login/Logout</Link>
      <Link to="/paypalButton">Make Payment</Link>
    </div>
  );
};

export default Navigation;
