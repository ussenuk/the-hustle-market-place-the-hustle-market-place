import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';



const ComposeMessagePage = () => {
  
  const [userProf, setUserProf] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [userName, setUserName] = useState('');

  /* useEffect(() => {
    const fetchUserProf = async () => {
      try {
        const sender_name = await fetch('http://localhost:5555/user_name');
        if (sender_name.ok) {
          const data = await sender_name.json();
          setUserProf(data.user_name);
        } else {
          console.error('Error fetching user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProf();
  }, []); */
  

  const pathParams = useParams();
  const senderId = sessionStorage.getItem("user_id");
  //const sender_name = userProf ? userProf.find(user => user.id === senderId)?.name : '';
  const receiverId = pathParams['receiverId'];
  console.log("receiverId: ", receiverId,
    "senderId:", senderId,
  );
  const [content, setContent] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    // Retrieve value from Session storage
    
    // Make API call to fetch service providers
    fetch("/user_name")
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

  const sendMessage = async () => {
    if (!senderId) {
      console.error('Null pointer exception: senderId is null');
      return;
    }

    if (!receiverId) {
      console.error('Null pointer exception: receiverId is null');
      return;
    }

    if (!content) {
      console.error('Null pointer exception: content is null');
      return;
    }


    try {
      await axios.post(`/new_message`, {
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        sender_name: senderName,
      });
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
      console.error(error.config);
    }
  };

  if (isLoading || userProf === null) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      <h2>{userProf.user || senderName} - Compose Message</h2>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ComposeMessagePage;