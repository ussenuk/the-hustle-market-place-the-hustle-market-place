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

    useEffect(() => {
        // Code to retrieve messages from the server
        const fetchMessages = async () => {
          try {
            const response = await axios.get(`http://localhost:5555/messages/inbox/${userId}`);
            setMessages(response.data);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };
        fetchMessages(); 
      }, [userId]);

      return (
        <div>
        <h2>Inbox</h2>
        {messages &&messages.map((message) => (
          <div key={message.id}>
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
