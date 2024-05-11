import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Search() {

  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [bookingDateTime, setBookingDateTime] = useState("");

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

  const handleBooking = async (serviceId) => {
    try {

        // Prepare booking data
        const bookingData = {
            service_provider_id: serviceId,  // Adjust this to get the correct service provider ID
            customer_id: sessionStorage.getItem('user_id'),  // Replacing customer_id with user_id
            time_service_provider_booked: new Date(bookingDateTime).toISOString().slice(0, 19).replace('T', ' ')
        };

        // Send booking request to the backend
        const response = await fetch('http://127.0.0.1:5555/add_booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }
        // Handle successful booking
        console.log('Booking created successfully');
    } catch (error) {
        console.error('Error creating booking:', error.message);
        // Handle error
    }
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
              <input
                type="datetime-local"
                value={bookingDateTime}
                onChange={(e) => setBookingDateTime(e.target.value)}
              />
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
