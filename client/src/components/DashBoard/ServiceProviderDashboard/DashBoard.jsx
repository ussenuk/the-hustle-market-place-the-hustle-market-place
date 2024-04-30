import React, { useState, useEffect } from 'react';
import './DashBoard.css';
import DashBoardHeader from './DashBoardHeader';
import Sidebar from './Sidebar';

import DashBoardPage from '../DashBoardPage';
import RightBar from './RightBar';

function DashBoard({onLogout, onLogin, user}) {
  // Retrieve dark mode state from localStorage or default to false
  const [isDark, setIsDark] = useState(
    localStorage.getItem('darkMode') === 'true' ? true : false
  );

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const appClass = isDark ? "grid-container-dark" : "grid-container";

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  useEffect(() => {
    // Store dark mode state in localStorage
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  console.log(user)
  if (user){
    return (
      <div className={appClass}>
        <DashBoardHeader OpenSidebar={OpenSidebar} isDark={isDark} setIsDark={setIsDark} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleMenuItemClick={handleMenuItemClick} onLogout={onLogout}/>
        <DashBoardPage selectedMenuItem={selectedMenuItem}/>
        <RightBar user={user}/>
        
  
      </div>
    );

  } else {
    return <h1>Service Provider not logged in. Please log in to view the Dashboard...</h1>;
  }

 
}

export default DashBoard;