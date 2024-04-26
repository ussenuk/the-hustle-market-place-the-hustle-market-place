import React from 'react';
import ProfileHeader from './ProfileHeader'
import './profile.css';
import userImage from './teacher.png';

function Profile() {
  return (
    <div className='profile'>
    <ProfileHeader/>
    <div className='user--profile'>
        <div className='user--detail'>
          <img src={userImage} alt="" />
          <h3 className='username'> <strong>Username</strong> : fullname</h3>
          <span className='profession'><strong>Bio</strong> : bio</span>
        </div>
        </div>
    
    </div>
  )
}

export default Profile