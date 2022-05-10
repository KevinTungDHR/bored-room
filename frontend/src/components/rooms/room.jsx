import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io();

const Room = ({ roomCode }) => {
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  useEffect(() => {
    socket.emit("join_room", roomCode);
    
    return () => socket.disconnect();
  }, []);

  useEffect(()=> {
      socket.on("message", (data) => console.log(data));
      socket.on("receive_message", (data) => {
        setList(list => [...list, data.message]);
      });
  },[socket]);

  

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send_message', { message: message, roomCode: roomCode });
  };

  return(
    <div>
      In Room {roomCode}
      <input type="text" onChange={(e) => setMessage(e.target.value)}/>
      <button onClick={sendMessage} >Send</button>
      <ul>
        {list.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  );
}

export default Room;