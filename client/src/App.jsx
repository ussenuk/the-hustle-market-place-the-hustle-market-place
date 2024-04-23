import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage/HomePage";
import AboutUs from "./components/AboutUs/AboutUs";
import UserLogin from "./components/Userlogin/UserLogin";
import BusinessLogin from "./components/Businesslogin/BusinessLogin";
import Navigation from './components/NavBar/Navbar';
import DashBoard from './components/DashBoard/ServiceProviderDashboard/DashBoard';

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

  // Check if the current location matches the Dashboard route
  const isDashboardRoute = location.pathname === '/dashboard';

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
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/businesslogin" element={<BusinessLogin />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </div>
  );
};


export default App;

