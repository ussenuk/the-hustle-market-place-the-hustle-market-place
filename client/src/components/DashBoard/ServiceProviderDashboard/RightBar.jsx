import React from 'react';
import "./DashBoard.css";
import Profile from './pages/Profile';
import Updates from './pages/Updates';


function RightBar() {
  return (
    <div className='RightSide'>
    <Profile />
        
    <Updates />
 
        
    </div>
  )
}

export default RightBar