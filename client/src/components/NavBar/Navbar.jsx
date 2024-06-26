

// client/src/components/NavBar/Navbar.jsx

import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import "./navbar.css";
import axios from "axios";

const Navigation = () => {

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    const fetchUnreadMessageCount = async () => {
      try {
        const response = await axios.get(`/api/messages/unreadCount`);
        setUnreadMessageCount(response.data.unreadCount);
      } catch (error) {
        console.error('Error fetching unread message count:', error);
      }
    };

    fetchUnreadMessageCount();
  }, []);


  
  const userId = sessionStorage.getItem("user_id");
  const businessId = sessionStorage.getItem("business_id");
    

  return (
    <div className="nav" id="nav">
      <Link to="/">Home</Link>
      {/* <Link to="/servicespage">Services</Link> */}
      {/* <Link to="/search">Search Service</Link> */}
      <Link to="/about">About Us</Link>
      <Link to="/businesslogins">{businessId ? "Business Profile/DashBoard":"Business Login/Register"}</Link>
      <Link to="/userlogins">{userId ? "Customer Logout":"Login/Logout"}</Link>
      
      <Link to="/inbox">Inbox{unreadMessageCount > 0 && `(${unreadMessageCount})`}</Link>
    </div>
  );
};

export default Navigation;
