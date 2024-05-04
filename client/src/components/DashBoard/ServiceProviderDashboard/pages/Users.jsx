import React, { useState } from 'react';
import {
  Input,
  Box,
  Divider,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import '../DashBoard.css';
import BookingByServiceProvider from './BookingByServiceProvider';

function Users() {
  const [emailAddresses, setEmailAddresses] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('Join Hutle Market Place and discover my amazing services!');

  const sendInvitations = () => {
    fetch('http://127.0.0.1:5555/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailAddresses: emailAddresses,
        additionalInfo: additionalInfo,
      }),
    })
    .then(response => {
      if (response.ok) {
        alert('Emails sent successfully!');
      } else {
        alert('Failed to send emails.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to send emails.');
    });
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>USER</h3>
      </div>
      <Box
        bgcolor="#f0f0f0"
        boxShadow="0px 10px 15px rgba(0, 0, 0, 0.1)"
        borderRadius="10px"
        width="90%"
        maxWidth="600px"
        mx="auto"
        p="20px"
        mt="50px"
      >
        <Box mb={4}>
          <Typography
            variant="h6"
            align="center"
            color="#263043"
            fontWeight="bold"
            mb="20px"
          >
            Invite Possible Customers for Your Service
          </Typography>
        </Box>
        <Divider />
        <Box mt={4}>
          <Input
            color="primary"
            placeholder="Enter email addresses separated by commas"
            size="large"
            type="email"
            fullWidth
            mb={4}
            required
            value={emailAddresses}
            onChange={(e) => setEmailAddresses(e.target.value)}
          />
          <textarea
            placeholder="Additional Information"
            rows={6} // Set the number of rows here
            style={{
              width: '100%',
              padding: '10px',
              borderColor: '#ced4da',
              borderRadius: '4px',
              resize: 'vertical',
            }}
            defaultValue={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
          <Tooltip title="Send Invitations">
            <Button
              size="large"
              variant="contained"
              color="primary"
              sx={{
                "&:hover": { bgcolor: "#004d40" },
              }}
              onClick={sendInvitations}
            >
              Submit
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <BookingByServiceProvider />
    </main>
  );
}

export default Users;
