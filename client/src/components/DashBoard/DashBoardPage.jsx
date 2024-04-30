import React from 'react';
import {Routes, Route} from "react-router-dom";
import Service from './ServiceProviderDashboard/pages/Service';
import Users from './ServiceProviderDashboard/pages/Users';
import Reviews from './ServiceProviderDashboard/pages/Reviews';
import Help from './ServiceProviderDashboard/pages/Help';
import AddServiceForm from './ServiceProviderDashboard/pages/AddServiceForm';
import DashBoardHome from './ServiceProviderDashboard/DashBoardHome';
import Admin from './ServiceProviderDashboard/pages/Admin'

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
      return <Admin />;
    case 'services':
      return <Admin />;
    case 'moderation':
      return <Admin />;
    case 'transactions':
      return <Admin />;
    case 'report':
      return <Admin />;
    default:
      return null; // Return null if no matching menu item found
  }
}

export default DashBoardPage;