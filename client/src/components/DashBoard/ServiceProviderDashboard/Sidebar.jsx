import React from 'react';
import './DashBoard.css';
import {BsCart3,BsPeopleFill, BsGrid1X2Fill} from 'react-icons/bs';
import { MdHomeRepairService,MdComment,MdHelpCenter, MdLogout } from "react-icons/md";
import { GiMechanicGarage } from "react-icons/gi";
import { FaPlusCircle } from "react-icons/fa";
import { Link,  useNavigate } from 'react-router-dom';


function Sidebar({openSidebarToggle, OpenSidebar, handleMenuItemClick, onLogout}) {
  const navigate = useNavigate();

  const handleSidebarClick = (path) => {
    navigate(path);
    OpenSidebar(); // Close sidebar after clicking a menu item
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
              <GiMechanicGarage className='icon_header'/> Hutle Dashboard
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
        <ul className='sidebar-list'>
          <li className='sidebar-list-item' onClick={() => handleMenuItemClick('dashboard')}>
            
              <BsGrid1X2Fill className='icon'/> Dashboard
            
          </li>
          <li className='sidebar-list-item' onClick={() => handleMenuItemClick('addserviceform')}>
            
            <FaPlusCircle className='icon'/> Add service
          
        </li>
          <li className='sidebar-list-item' onClick={() => handleMenuItemClick('service')}>
            
              <MdHomeRepairService className='icon'/> Service
            
          </li>
          <li className='sidebar-list-item' onClick={() => handleMenuItemClick('users')}>
            
              <BsPeopleFill className='icon'/> Users
           
          </li>
          <li className='sidebar-list-item' onClick={() => handleMenuItemClick('reviews')}>
            
              <MdComment className='icon'/> Comments and Reviews
            
          </li>
          <li className='sidebar-list-item' onClick={() => handleMenuItemClick('help')}>
            
              <MdHelpCenter className='icon'/> Help
            
          </li>
          <li className='sidebar-list-item' onClick={onLogout}>

              <MdLogout className='icon' /> Logout
          </li>
        
        
        </ul>
    
    </aside>
  )
}

export default Sidebar