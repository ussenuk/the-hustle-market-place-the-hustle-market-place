import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Search() {

  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5555/services')
      .then(res => {
        setData(res.data)
        setRecords(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const Filter = (event) => {
    setRecords(data.filter(f => f.service_title.toLowerCase().includes(event.target.value.toLowerCase())));
  }

  const handleBooking = (serviceId) => {
    // Handle booking logic
    console.log("Booking service with ID:", serviceId);
  };

  const handleMessaging = (serviceProviderId) => {
    // Handle messaging logic
    console.log("Messaging service provider with ID:", serviceProviderId);
  };

  const handleRating = (serviceId, rating) => {
    // Handle rating logic
    console.log("Rating service with ID:", serviceId, "Rating:", rating);
  };

  const handleLeaveComment = (serviceId, comment) => {
    // Handle leave comment logic
    console.log("Leaving comment for service with ID:", serviceId, "Comment:", comment);
  };

  return (
    <div className='p-5 bg-light'>
      <input
        type="text"
        placeholder="Search"
        onChange={Filter}
      />
      <div className='bg-white shadow border'>
        {records.map((val, i) => {
          return (
            <div className='p-3 border-bottom' key={i}>
              <h3>{val.service_title}</h3>
              <p>{val.service_category}</p>
              <p>{val.service_price}</p>
              <p>Posted by: {val.service_provider}</p>
              <p>Location: {val.location}</p>
              <p>Available Hours: {val.hours_available}</p>
              <p>Pricing: {val.pricing}</p>
              <button onClick={() => handleBooking(val.service_id)}>Book Now</button>
              <button onClick={() => handleMessaging(val.service_provider_id)}>Message</button>
              <select onChange={(e) => handleRating(val.service_id, e.target.value)}>
                <option value="">Rate this service</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <textarea
                rows="3"
                placeholder="Leave a comment"
                onChange={(e) => handleLeaveComment(val.service_id, e.target.value)}
              ></textarea>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Search
