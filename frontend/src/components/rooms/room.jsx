import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { fetchRoom  } from '../../actions/room_actions';
import { joinRoom, leaveRoom } from '../../util/rooms_util';
import { receiveRoom } from '../../actions/room_actions';
const socket = io();

const Room = () => {
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  // const [joinFulfilled, setJoinFulfilled] = useState(true);
  // const [leaveFulfilled, setLeaveFulfilled] = useState(true);

  const { code: roomCode } = useParams();
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.entities.rooms);

  useEffect(() => {
    socket.emit("join_room", roomCode);
    dispatch(fetchRoom(roomCode));
    return () => socket.disconnect();
  }, []);

  useEffect(()=> {
      socket.on("message", (data) => console.log(data));
      socket.on("receive_message", (data) => {
        setList(list => [...list, data.message]);
      });
      socket.on("user_sits", (room) => dispatch(receiveRoom(room)));
      socket.on("user_leaves", (room) => dispatch(receiveRoom(room)));
  },[socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send_message', { message: message, roomCode: roomCode });
  };
  
  const joinSeat = (e) => {
    console.log("Click before fulfill check");
    e.preventDefault();
    joinRoom(roomCode)
  };

  const leaveSeat = (e) => {
    e.preventDefault();
    leaveRoom(roomCode)
  };

  return(
    <div>
      In Room {roomCode}
      <input type="text" onChange={(e) => setMessage(e.target.value)}/>
      <button onClick={sendMessage} >Send</button>
      <ul>
        {list.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>

      <div>Seated Users</div>
      <ul>
        {Object.values(rooms).length > 0 && rooms[roomCode].seatedUsers.map((user, idx) => <li key={idx}>{user.handle}</li>)}
      </ul>
      <button onClick={joinSeat}>Sit</button>
      <button onClick={leaveSeat}>Get Up</button>
    </div>
  );
}

export default Room;