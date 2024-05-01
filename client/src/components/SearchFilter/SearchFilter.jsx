/* import React, {useState} from 'react';
//import './SearchFilter.css';
import ServicesPage from '../ServicesPage/ServicesPage';

const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div className="templateContainer">
      <div className='searchInput_Container'>
        <input type="text" placeholder="Search"
        onChange={(event) => {
          setSearchTerm(event.target.value)
        }}
        />
      </div>
      <div className='template_Container'>
        {services
          .filter((val) => {
            if (searchTerm === "") {
              return val
            } else if (val.service_title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val;
          }
        })
        .map((val, key) => {
          return (
            <div className='template' key={val.id}>
              <h3>{val.service_title}</h3>
              <p>{val.service_category}</p>
              <p>{val.service_price}</p>

            
            </div>
          )
        })
        }
        </div>
    </div>
    </>
    
  )
}

export default SearchFilter; */

import React, { useState } from "react";

const SearchFilter = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [availabilityHours, setAvailabilityHours] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [userRating, setUserRating] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchQuery, priceRange, availabilityHours, serviceCategory, userRating });
  };

  const priceRanges = [
    { label: "$0 - $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $150", min: 100, max: 200 },
    { label: "$150 - $200", min: 150, max: 200 },
  ];

  return (
    <div className="search-filter">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by service title"
        />
        <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)}>
          <option value="">Select Service Category</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Painting">Painting</option>
          <option value="Landscaping">Landscaping</option>
        </select>
        <select
          value={`${priceRange.min}-${priceRange.max}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split("-");
            setPriceRange({ min: parseFloat(min), max: parseFloat(max) });
          }}
        >
          <option value="">Select Price Range</option>
          {priceRanges.map(({ label }) => (
            <option key={label} value={`${label}`}>{label}</option>
          ))}
        </select>
        <select value={availabilityHours} onChange={(e) => setAvailabilityHours(e.target.value)}>
          <option value="">Select Availability Hours</option>
          <option value="9-12">9:00 AM - 12:00 PM</option>
          <option value="1-5">1:00 PM - 5:00 PM</option>
          <option value="10-2">10:00 AM - 2:00 PM</option>
          <option value="8-10">8:00 AM - 10:00 AM</option>
          <option value="3-7">3:00 PM - 7:00 PM</option>
          <option value="">Out of Stock</option>
        </select>
      
        <select value={userRating} onChange={(e) => setUserRating(e.target.value)}>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchFilter;
