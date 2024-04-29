

// client/src/App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage/HomePage";
import AboutUs from "./components/AboutUs/AboutUs";
import UserLogin from "./components/Userlogin/UserLogin";
import BusinessLogin from "./components/Businesslogin/BusinessLogin";
import Navigation from './components/NavBar/Navbar';
import DashBoard from './components/DashBoard/ServiceProviderDashboard/DashBoard';
import AdminAccess from "./components/Admin/Admin";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  // Get the current location
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the current location matches the Dashboard route
  const isDashboardRoute = location.pathname === '/dashboard';

  useEffect(() => {
    const businessId = sessionStorage.getItem("business_id");
    if (businessId) {
      setIsLoggedIn(true);
      console.log(isLoggedIn)
      // navigate("/dashboard");  // Assume '/dashboard' is the route for logged-in users
    }
  }, []);



  function handleLogin(isLoggedIn){
    setIsLoggedIn(isLoggedIn);
  }

  const handleLogout = () => {
    sessionStorage.removeItem("business_id");
    setIsLoggedIn(false);
    navigate("/"); // Navigate to the home page after logging out
  };

  return (
    <div className={isDashboardRoute ? "" : "app-container"}>
      {/* Render Header and Navigation only if the route is not Dashboard */}
      {!isDashboardRoute && (
        <>
          <Header />
          <Navigation />
        </>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin" element={<AdminAccess />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/businesslogin" element={<BusinessLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/dashboard" element={<DashBoard  user={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout}/>} />
      </Routes>
    </div>
  );
};


export default App;

