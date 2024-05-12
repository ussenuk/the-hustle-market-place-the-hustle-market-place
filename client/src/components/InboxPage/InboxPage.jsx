/* import React from "react";
import Chat from "../Chat/Chat";

const ChatPage = () => {
  // Assuming you have some state or information about the current user and recipient
  const currentUser = "UserA"; // Example: Get the current user from your authentication system
  const service_provider = "ServiceProviderB"; // Example: Get the recipient from your application's data
  
  return (
    <div>
      <h1>Chat with {service_provider}</h1>
      <Chat currentUser={currentUser} service_provider={service_provider} />
    </div>
  );
};

export default ChatPage;
 */

// MessagingComponent.js

/* import React, { useState } from 'react';
import axios from 'axios';

const MessagingComponent = ({ serviceProviderId }) => {
  const [message, setMessage] = useState('');

  const handleMessageSend = async () => {
    try {
      await axios.post('http://localhost:5000/send_message', {
        sender_id: loggedInUserId, // You need to get the logged-in user's ID
        receiver_id: serviceProviderId,
        content: message
      });
      alert('Message sent successfully');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
};

export default MessagingComponent; */

// MessagingComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';



function InboxPage() {

    const userId = sessionStorage.getItem('user_id');
    const [messages, setMessages] = useState([]);
    const [userProf, setUserProf] = useState("");
    const [senderName, setSenderName] = useState("");

    useEffect(() => {
        // Code to retrieve messages from the server
        const fetchMessages = async () => {
          try {
            const response = await axios.get(`http://localhost:5555/messages/inbox/${userId}`);
            setMessages(response.data);
            console.log(response.data);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };
        fetchMessages(); 
      }, [userId]);


      useEffect(() => {
        const userId = sessionStorage.getItem("user_id");
        // Retrieve value from Session storage
        
        // Make API call to fetch service providers
        fetch("http://localhost:5555/user_name")
          .then((response) => response.json())
          .then((data) => {
            // Find service provider with matching ID
            const user = data.find(
              (provider) => provider.id === parseInt(userId)
            );
            console.log(user)
            //console.log(userId)
            if (user) {
              setUserProf(user);
              setSenderName(user.user);
            }
          })
          .catch((error) =>
            console.error("Error fetching service providers:", error)
          );
      }, []);

      /* const fetchUserName = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5555/get_logged_in_username/${userName}`);
          if (response.ok) {
            const data = await response.json();
            setUserName(data);
          } else {
            throw new Error('Failed to fetch user name');
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
          // Handle error if needed
        }
        fetchUserName();
        
      };
      console.log(userName.data)
 */
      return (
        <div>
        <h2>Inbox</h2>
        {messages && messages.map((message, index) => (
          <div key={index}>
            <p>From: {userProf.user || senderName}</p>
            <p>To: {message.receiver_id}</p>
            <p>Message: {message.content}</p>
          </div>
        ))}
        </div>
      );

    /* useEffect(() => {
        // SocketIO event for receiving new messages
        socket.on('new-message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socket.off('new-message');
        };
    }, []);

    const sendMessage = () => {
        // Code to send message to the server
        fetch('http://localhost:5555/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senderId: user_id, receiverId: serviceProvider_id, message: newMessage })
        });
        setNewMessage('');
    };

    return (
        <div>
            <h1>Messages with {serviceProvider.name}</h1>
            {messages.map((message, index) => (
                <div key={index}>{message.message}</div>
            ))}
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    ); */
}

export default InboxPage;
