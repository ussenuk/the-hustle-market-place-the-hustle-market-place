import React from 'react';

import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify, BsFillLightbulbFill, BsFillMoonFill, BsFillSunsetFill, BsFillSunFill} from 'react-icons/bs';

import './DashBoard.css';

function DashBoardHeader({OpenSidebar, isDark, setIsDark}) {

  
  function handleToggleClickMoon(){
    setIsDark(true)
  }
  function handleToggleClickSun(){
    setIsDark(false)
  }
  


  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            <BsSearch className='icon'/>
        </div>
        <div className='header-right'>
            <BsFillSunFill className={`icon ${!isDark ? 'active-icon' : ''}`} onClick={handleToggleClickSun}/>
            <BsFillMoonFill className={`icon ${isDark ? 'active-icon' : ''}`} onClick={handleToggleClickMoon}/>
            <BsFillBellFill className='icon' />
            <BsFillEnvelopeFill className='icon'/>
        </div>
    </header>
  )
}

export default DashBoardHeader