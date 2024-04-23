import React from 'react';
import './DashBoard.css';
import {BsCart3,BsPeopleFill, BsGrid1X2Fill} from 'react-icons/bs';
  import { MdHomeRepairService,MdComment,MdHelpCenter } from "react-icons/md";
  import { GiMechanicGarage } from "react-icons/gi";

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
              <GiMechanicGarage className='icon_header'/> Hutle Dashboard
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
        <ul className='sidebar-list'>
          <li className='sidebar-list-item'>
            <a href=''>
              <BsGrid1X2Fill className='icon'/> Dashboard
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href=''>
              <MdHomeRepairService className='icon'/> Service
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href=''>
              <BsPeopleFill className='icon'/> Users
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href=''>
              <MdComment className='icon'/> Comments and Reviews
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href=''>
              <MdHelpCenter className='icon'/> Help
            </a>
          </li>
        
        
        </ul>
    
    </aside>
  )
}

export default Sidebar