import React from 'react';
import "./DashBoard.css";
import Profile from './pages/Profile';
import Updates from './pages/Updates';


function RightBar({user}) {
  return (
    <div className='RightSide'>
    <Profile user={user} />
        
    <Updates />
 
        
    </div>
  )
}

export default RightBar