import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentPage.css'; // Import CSS file for styling
import PayPalButton from '../../components/Paypal/PayPalButton';

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get('serviceId');
  const price = queryParams.get('price');
  const [serviceName, setServiceName] = useState('');
  const [serviceProviderName, setServiceProviderName] = useState('');
  const [userName, setUserName] = useState('');
  
  
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch service name
        const serviceResponse = await fetch(`/search_service_name/${serviceId}`);
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          setServiceName(serviceData.service_name);
        } else {
          throw new Error('Failed to fetch service name');
        }

        // Fetch service provider name
        const serviceProviderResponse = await fetch(`/service_provider_name/${serviceId}`);
        if (serviceProviderResponse.ok) {
          const serviceProviderData = await serviceProviderResponse.json();
          setServiceProviderName(serviceProviderData.service_provider_name);
        } else {
          throw new Error('Failed to fetch service provider name');
        }

        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error if needed
      }
    };

    fetchUserData();
  }, [serviceId]);

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    // Retrieve value from Session storage
    
    // Make API call to fetch service providers
    fetch("/user_name")
      .then((response) => response.json())
      .then((data) => {
        // Find service provider with matching ID
        const User = data.find(
          (provider) => provider.id === parseInt(userId)
        );
        if (User) {
          setUserInfo(User);
        }
      })
      .catch((error) =>
        console.error("Error fetching service providers:", error)
      );
  }, []);

  return (
    <div className="payment-page-container">
      <p>Welcome {userInfo.user}, you can now proceed with your payment.</p>
      <p>Pay for Service: {serviceName}</p>
      <p className="service-provider-info">Service provided by: {serviceProviderName}</p>
      <div className="payment-details-container">
        <div className="payment-info">
          {/* <p>Price: 10USD</p> */}
          {/* Add more payment details as needed */}
        </div>
        <div className="paypal-button-container">
          <PayPalButton serviceId={serviceId} price={price} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;