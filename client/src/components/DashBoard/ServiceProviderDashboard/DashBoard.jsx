import React, {useState} from 'react';
import './DashBoard.css'
import DashBoardHeader from './DashBoardHeader';
import Sidebar from './Sidebar';
import DashBoardHome from './DashBoardHome';

function DashBoard() {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    <div className='grid-container'>
        <DashBoardHeader OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
        <DashBoardHome />
    </div>
  )
}

export default DashBoard