import React from 'react';
import {Routes, Route} from "react-router-dom";
import Service from './ServiceProviderDashboard/pages/Service';
import Users from './ServiceProviderDashboard/pages/Users';
import Reviews from './ServiceProviderDashboard/pages/Reviews';
import Help from './ServiceProviderDashboard/pages/Help';
import DashBoardHome from './ServiceProviderDashboard/DashBoardHome';

function DashBoardPage({ selectedMenuItem }) {
  switch (selectedMenuItem) {
    case 'dashboard':
      return <DashBoardHome />;
    case 'service':
      return <Service />;
    case 'users':
      return <Users />;
    case 'reviews':
      return <Reviews />;
    case 'help':
      return <Help />;
    default:
      return null; // Return null if no matching menu item found
  }
}

export default DashBoardPage;