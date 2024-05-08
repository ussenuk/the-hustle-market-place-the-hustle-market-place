/* import {useEffect, useState} from "react";
import HttpCall from "../HttpCall/HttpCall";
import {io} from "socket.io-client"
import WebSocketCall from "../WebSocket/WebSocket";


const socket = io('<http://localhost:3000>');


function Message() {

  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);

  const handleClick = () => {
    if (buttonStatus===false) {
      setButtonStatus(true);
    }else{
      setButtonStatus(false);
    }
  }

  useEffect(() => {
    if (buttonStatus === true) {
      const socket = io("localhost:3000", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      });

      setSocketInstance(socket)

      socket.on('connect', (data) => {
        console.log(data)
      })

      setLoading(false)

      socket.on('disconnect', (data) => {
        console.log(data)
      })

      return function cleanup() {
        socket.disconnect();
      }
    }
  },[buttonStatus]);

  return (
    <div>
      <h1>Message</h1>
      <div className="line">
        <HttpCall/>
      </div>
      {!buttonStatus ? (
        <button onClick={handleClick}>Tun Chat on</button>
      ): (
        <>
          <button onClick={handleClick}>Tun Chat off</button>
          <div className="line">
            {!loading && <WebSocketCall socket={socketInstance} />}
          </div>
        </>
      )}
      
    </div>
    
  )
}

export default Message */