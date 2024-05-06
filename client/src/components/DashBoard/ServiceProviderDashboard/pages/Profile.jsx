import React, {useState, useEffect} from 'react';
import ProfileHeader from './ProfileHeader'
import './profile.css';
import userImage from './teacher.png';

function Profile({user}) {

  const [serviceProviderInfo, setServiceProviderInfo] = useState({});
  useEffect(() => {
    // Retrieve value from Session storage
    const serviceProviderId = sessionStorage.getItem('business_id');

    // Make API call to fetch service providers
    fetch("http://localhost:5555/service_provider")
      .then(response => response.json())
      .then(data => {
        // Find service provider with matching ID
        const serviceProvider = data.find(provider => provider.id === parseInt(serviceProviderId));
        if (serviceProvider) {
          setServiceProviderInfo(serviceProvider);
        }
      })
      .catch(error => console.error('Error fetching service providers:', error));
  }, []);

  const [adminInfo, setAdminInfo] = useState({});
  const Adminchecker = sessionStorage.getItem('admin_id');
  useEffect(() => {
    // Retrieve value from Session storage
    const AdminId = sessionStorage.getItem('admin_id');

    // Make API call to fetch service providers
    fetch("http://localhost:5555/admin")
      .then(response => response.json())
      .then(data => {
        // Find service provider with matching ID
        const Admin = data.find(admin => admin.id === parseInt(AdminId));
        if (Admin) {
          setAdminInfo(Admin);
        }
      })
      .catch(error => console.error('Error fetching service providers:', error));
  }, []);

  console.log('Profile Picture URL:', serviceProviderInfo.profile_picture_url);

  return (
    <div className='profile'>
    { Adminchecker ? (
      <>
      <ProfileHeader/>
        <div className='user--profile'>
        <div className='user--detail'>
          <img src={userImage} alt="" />
          <h3 className='username'>  {adminInfo.admin}</h3>
          <p><strong>Role:</strong> Admin</p>
        </div>
        </div>
      </>
    ):(<>
      <ProfileHeader/>
        <div className='user--profile'>
        <div className='user--detail'>
          <img src={`http://localhost:5555${serviceProviderInfo.profile_picture_url}` || userImage} alt=""  />
          <h3 className='username'>  {serviceProviderInfo.service_provider}</h3>
          <p><strong>Service Title:</strong> {serviceProviderInfo.service_title}</p>
          <span className='profession'><strong>Bio</strong> : {serviceProviderInfo.bio}</span>
        </div>
        </div>
      </>) 
    
    }
    
    
    </div>
  )
}

export default Profile