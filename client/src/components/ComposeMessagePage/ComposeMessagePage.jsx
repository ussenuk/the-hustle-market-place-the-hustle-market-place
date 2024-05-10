import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';



const ComposeMessagePage = () => {
  
  const [userProf, setUserProf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProf = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/users`);
        setUserProf(response.data.username);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching (success or failure)
      }
    };
    fetchUserProf();
  }, []);

  const pathParams = useParams();

  const senderId = sessionStorage.getItem("user_id");
  //const sender_name = userProf ? userProf.find(user => user.id === senderId)?.name : '';
  const sender_name = userProf && senderId
    ? userProf.find(user => user.id === parseInt(senderId))?.username
    : '';
  const receiverId = pathParams['receiverId'];
  console.log("receiverId: ", receiverId,
    "senderId:", senderId,
    "sender_name:", sender_name
  );



  const [content, setContent] = useState('');

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

    if (!sender_name) {
      console.error('Null pointer exception: content is null');
      return;
    }

    try {
      await axios.post(`http://localhost:5555/new_message`, {
        sender: senderId,
        sender_name: sender_name,
        receiver: receiverId,
        content: content
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
      <h2>Compose Message</h2>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ComposeMessagePage;