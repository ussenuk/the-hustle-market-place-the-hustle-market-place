import React from 'react';
import {
  Input,
  Box,
  Divider,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import '../DashBoard.css';

function Users() {
  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>USER</h3>
      </div>
      <Box
        bgcolor="#9e9ea4"
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
            mb={3}
          />
          <Tooltip title="Send Invitations">
            <Button
              size="large"
              variant="contained"
              color="primary"
              sx={{
                "&:hover": { bgcolor: "#004d40" },
              }}
            >
              Submit
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </main>
  );
}

export default Users;
