import React from 'react';
import BookingTable from './pages/BookingTable'
import './DashBoard.css'
import { BsPeopleFill, BsFillBellFill,BsMailbox2Flag } from 'react-icons/bs'

function DashBoardHome() {
  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon'/>
          </div>
          <h1>5</h1>
          
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ALERT</h3>
            <BsFillBellFill className='card_icon'/>
          </div>
          <h1>12</h1>
          
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>MESSAGES</h3>
            <BsMailbox2Flag className='card_icon'/>
          </div>
          <h1>12</h1>
          
        </div>

        
      
      </div>

    

    <BookingTable />
    
    


    </main>
  )
}

export default DashBoardHome