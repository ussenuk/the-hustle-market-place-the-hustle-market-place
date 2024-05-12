import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { BiEdit } from 'react-icons/bi';
import axios from 'axios'; // Import axios for making HTTP requests
import "./profile.css";

const ProfileHeader = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    location: '',
    business_description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const user_id = sessionStorage.getItem('business_id');
        const user_type = 'service_provider';
        const response = await axios.get(`/user/${user_id}/${user_type}`);
        const serviceProvider = response.data;
        setFormData({
          fullname: serviceProvider.fullname,
          email: serviceProvider.email,
          location: serviceProvider.location,
          business_description: serviceProvider.business_description
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service provider data:', error);
      }
    }

    fetchData();
  }, []);

  function handleUpdateClick() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
    window.location.reload(); // Refresh the page
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const user_id = sessionStorage.getItem('business_id');
      const user_type = 'service_provider';
      const response = await axios.patch(`/user/${user_id}/${user_type}`, formData);
      console.log(response.data);
      closeModal();
    } catch (error) {
      console.error('Error updating service provider:', error);
    }
  }
  
  return (
    <div className='profile--header'>
      <h2 className='header--title'>User Profile:</h2>
      <div className='edit' onClick={handleUpdateClick}>
        <BiEdit className='icon'/>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2>Update Service Provider</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Full Name:
                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>
              <label>
                Location:
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
              </label>
              <textarea
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleChange}
                  rows={6} // Specify the number of visible rows
                  cols={50} // Specify the number of visible columns
                ></textarea>
              <button type="submit">Update</button>
            </form>
            <button onClick={closeModal}>Close</button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default ProfileHeader;
