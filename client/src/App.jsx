

// // client/src/App.jsx

// //import React, { useState, useEffect } from "react";
// //import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
// import Header from "./components/Header/Header";
// import HomePage from "./components/HomePage/HomePage";
// import AboutUs from "./components/AboutUs/AboutUs";
// import UserLogin from "./components/Userlogin/UserLogin";
// import BusinessLogin from "./components/Businesslogin/BusinessLogin";
// import ServicesPage from "./components/ServicesPage/ServicesPage";
// import Navigation from './components/NavBar/Navbar';
// import DashBoard from './components/DashBoard/ServiceProviderDashboard/DashBoard';
// import Search from "./components/Search/Search";
// import AdminAccess from "./components/Admin/Admin";
// import PayPalButton from "./components/Paypal/PayPalButton";
// import axios from "axios";

// const App = () => {


//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// };

// const AppContent = () => {
//   // Get the current location
//   const location = useLocation();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false);
//   const navigate = useNavigate();

//   // Check if the current location matches the Dashboard route
//   const isDashboardRoute = location.pathname === '/dashboard';

//   useEffect(() => {

//     const businessId = sessionStorage.getItem("business_id");
//     const adminId = sessionStorage.getItem("admin_id");
//     if (adminId) {
//       setIsLoggedInAdmin(true);
//         }
//     if (businessId) {
//       setIsLoggedIn(true);
//       console.log(isLoggedIn)
//       // navigate("/dashboard");  // Assume '/dashboard' is the route for logged-in users
//     }
//   }, []);
 


//   function handleLogin(isLoggedIn){
//     setIsLoggedIn(isLoggedIn);
//     setIsLoggedInAdmin(isLoggedInAdmin);
//   }

//   const handleLogoutAdmin = async () => {
//     try {
//     await axios.get("http://localhost:5555/adminlogout");
//     sessionStorage.removeItem("admin_id");
//     setIsLoggedInAdmin(false);
//     navigate("/"); // Navigate to the home page after logging out
 

//     } catch(error) {
//       console.error("Logout error:", error);
//     }
//      };

//      const handleLogoutServiceProvider = async () => {
//       try {
//       await axios.get("http://localhost:5555/businesslogout");
//       sessionStorage.removeItem("business_id");
//       setIsLoggedIn(false);
//       navigate("/"); // Navigate to the home page after logging out
   
  
//       } catch(error) {
//         console.error("Logout error:", error);
//       }
//        };

//   return (
//     <div className={isDashboardRoute ? "" : "app-container"}>
//       {/* Render Header and Navigation only if the route is not Dashboard */}
//       {!isDashboardRoute && (
//         <>
//           <Header />
//           <Navigation />
//         </>
//       )}

//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/admin" element={<AdminAccess isLoggedInAdmin={isLoggedInAdmin} setIsLoggedInAdmin={setIsLoggedInAdmin}/>} />
//         <Route path="/userlogin" element={<UserLogin />} />
//         <Route path="/servicespage" element={<ServicesPage />} />
//         <Route path="/businesslogin" element={<BusinessLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
//         <Route path="/dashboard" element={<DashBoard  user={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout}/>} />
//         <Route path="/PayPalButton" element={<PayPalButton isLoggedIn={isLoggedIn} />} /> {/* Define PayPalButton route */}
//       </Routes>
//     </div>
//   );
// };


// export default App;



// client/src/App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage/HomePage";
import AboutUs from "./components/AboutUs/AboutUs";
import UserLogin from "./components/Userlogin/UserLogin";
import BusinessLogin from "./components/Businesslogin/BusinessLogin";
import ServicesPage from "./components/ServicesPage/ServicesPage";
import Navigation from './components/NavBar/Navbar';
import DashBoard from './components/DashBoard/ServiceProviderDashboard/DashBoard';
import Search from "./components/Search/Search";
import AdminAccess from "./components/Admin/Admin";
import PayPalButton from "./components/Paypal/PayPalButton";
import PaymentPage from './components/PaymentPage/PaymentPage';
import axios from "axios";
import ComposeMessagePage from "./components/ComposeMessagePage/ComposeMessagePage";
import InboxPage from "./components/InboxPage/InboxPage";

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
  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if the current location matches the Dashboard route
  const isDashboardRoute = location.pathname === '/dashboard';

  useEffect(() => {

    const businessId = sessionStorage.getItem("business_id");
    const adminId = sessionStorage.getItem("admin_id");
    if (adminId) {
      setIsLoggedInAdmin(true);
        }
    if (businessId) {
      setIsLoggedIn(true);
      console.log(isLoggedIn)
      // navigate("/dashboard");  // Assume '/dashboard' is the route for logged-in users
    }
  }, []);
 


  function handleLogin(isLoggedIn){
    setIsLoggedIn(isLoggedIn);
    setIsLoggedInAdmin(isLoggedInAdmin);
  }

  const handleLogoutAdmin = async () => {
    try {
    await axios.get("http://localhost:5555/adminlogout");
    sessionStorage.removeItem("admin_id");
    setIsLoggedInAdmin(false);
    navigate("/"); // Navigate to the home page after logging out
 

    } catch(error) {
      console.error("Logout error:", error);
    }
     };

     const handleLogoutServiceProvider = async () => {
      try {
      await axios.get("http://localhost:5555/businesslogout");
      sessionStorage.removeItem("business_id");
      setIsLoggedIn(false);
      navigate("/"); // Navigate to the home page after logging out
   
  
      } catch(error) {
        console.error("Logout error:", error);
      }
       };

  const handleNavigateHome = () => {
  navigate('/');
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
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin" element={<AdminAccess isLoggedInAdmin={isLoggedInAdmin} setIsLoggedInAdmin={setIsLoggedInAdmin}/>} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/servicespage" element={<ServicesPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/businesslogin" element={<BusinessLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/dashboard" element={<DashBoard  user={isLoggedIn} admin={isLoggedInAdmin} onLogin={handleLogin} onLogout={handleLogoutServiceProvider} onLogout2={handleLogoutAdmin} goHome={handleNavigateHome}/>} />
        <Route path="/search" element={<Search />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/new_message/:receiverId" element={<ComposeMessagePage />} />
        <Route path="/PayPalButton" element={<PayPalButton isLoggedIn={isLoggedIn} />} /> {/* Define PayPalButton route */}
//       
      </Routes>
    </div>
  );
};


export default App;