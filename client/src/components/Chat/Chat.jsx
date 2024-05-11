/* /* /* import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [username] = useState("jsmith");
  const [socket, setSocket] = useState(null);
  const [roomOccupied, setRoomOccupied] = useState(false);

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:5555/message", {
      auth: {
        token: "123",
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("join", (value) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `${value.username} joined the room`,
        ]);
      });

      socket.on("leave", (value) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `${value.username} left the room`,
        ]);
      });

      socket.on("message", (value) => {
        const css = value.username === username ? "my-message" : "other-message";
        setMessages((prevMessages) => [
          ...prevMessages,
          <li className={css}>{value.message}</li>,
        ]);
      });

      socket.on("roomOccupied", () => {
        setRoomOccupied(true);
      });

      socket.on("roomVacant", () => {
        setRoomOccupied(false);
      });
    }
  }, [socket, username]);

  const sendMessage = () => {
    if (!roomOccupied) {
      socket.emit("message", { username, message: messageInput, room });
      setMessageInput("");
    } else {
      alert("Room is already occupied");
    }
  };

  const joinRoom = () => {
    setRoom(document.getElementById("room-input").value);
    socket.emit("join", { username, room });
    document.getElementById("room-input").value = "";
    document.getElementById("room").classList.remove("hidden");
    document.getElementById("room-select").classList.add("hidden");
  };

  const leaveRoom = () => {
    socket.emit("leave", { username, room });
    document.getElementById("room").classList.add("hidden");
    document.getElementById("room-select").classList.remove("hidden");
  };

  return (
    <div className="container">
      <div className={room ? "" : "hidden"} id="room">
        <div id="messages">
          <ul>{messages}</ul>
        </div>
        <div className="controls">
          <input
            id="message-input"
            placeholder="add message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button id="send-button" onClick={sendMessage}>Send message</button>
          <button id="leave-button" onClick={leaveRoom}>Leave room</button>
        </div>
      </div>

      <div className={room ? "hidden" : "controls"} id="room-select">
        <input id="room-input" placeholder="select room" />
        <button id="join-button" onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default Chat;
 */


import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

/*
const Chat = ({ username, service_provider }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:5555/message", {
      auth: {
        token: "123",
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (value) => {
        const css =
          value.sender === username ? "my-message" : "other-message";
        setMessages((prevMessages) => [
          ...prevMessages,
          <li className={css}>{value.message}</li>,
        ]);
      });
    }
  }, [socket, username, service_provider]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", {
        sender: currentUser,
        service_provider: service_provider,
        message: messageInput,
      });
      setMessageInput("");
    }
  };

  return (
    <div className="container">
      <div id="messages">
        <ul>{messages}</ul>
      </div>
      <div className="controls">
        <input
          id="message-input"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button id="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
 */

// Chat component to handle messaging between users and service providers
//const Chat = ({ currentUser, recipient }) => {
  // State to manage messages
  //const [messages, setMessages] = useState([]);
  //const [messageInput, setMessageInput] = useState("");
 // const [socket, setSocket] = useState(null);

  // Initialize socket connection
  /* useEffect(() => {
    const newSocket = io("http://127.0.0.1:5555/message", {
      auth: {
        token: "123",
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Send message function
  const sendMessage = () => {
    // Emit message event to the backend
    socket.emit("message", {
      sender: currentUser,
      recipient: recipient,
      message: messageInput,
    });
    setMessageInput("");
  };

  // Render messages
  return (
    <div>
      /* Render messages */
      //{messages.map((msg, index) => (
        //<div key={index}>{msg}</div>
      //))}
      
      /* Input field and send button */
//      <input
  //      type="text"
    //    value={messageInput}
      //  onChange={(e) => setMessageInput(e.target.value)}
      ///>
      //<button onClick={sendMessage}>Send</button>
    //</div>
  //);
//}; 


export default Chat; 