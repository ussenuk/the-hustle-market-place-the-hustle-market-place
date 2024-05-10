import React from 'react';
import {Routes, Route} from "react-router-dom";
import Service from './ServiceProviderDashboard/pages/Service';
import Users from './ServiceProviderDashboard/pages/Users';
import Reviews from './ServiceProviderDashboard/pages/ReviewByServiceProvider';
import Help from './ServiceProviderDashboard/pages/Help';
import AddServiceForm from './ServiceProviderDashboard/pages/AddServiceForm';
import DashBoardHome from './ServiceProviderDashboard/DashBoardHome';
import Admin from './ServiceProviderDashboard/pages/Admin'
import UsersList from './ServiceProviderDashboard/pages/UsersList';
import Services from './ServiceProviderDashboard/pages/Services';
import PaymentForm from './ServiceProviderDashboard/pages/Payment';

function DashBoardPage({ selectedMenuItem }) {
  switch (selectedMenuItem) {
    case 'dashboard':
      return <DashBoardHome />;
    case 'service':
      return <Service />;
    case 'addserviceform':
      return <AddServiceForm />;
    case 'users':
      return <Users />;
    case 'reviews':
      return <Reviews />;
    case 'help':
      return <Help />;
    case 'allusers':
      return <UsersList />;
    case 'services':
      return <Services />;
    case 'moderation':
      return <Admin />;
    case 'transactions':
      return <PaymentForm />;
    case 'report':
      return <Admin />;
    default:
      return null; // Return null if no matching menu item found
  }
}

export default DashBoardPage;