

// client/src/components/NavBar/Navbar.jsx

import React from "react";

import { Link } from "react-router-dom";

import "./navbar.css";

const Navigation = () => {
  return (
    <div className="nav" id="nav">
      <Link to="/">Home</Link>
      <Link to="/servicespage">Services</Link>
      <Link to="/addserviceform">Add Service</Link>
      <Link to="/about">About Us</Link>
      <Link to="/businesslogin">Business Login/Register</Link>
      <Link to="/userlogin">Login as User</Link>
    </div>
  );
};

export default Navigation;
