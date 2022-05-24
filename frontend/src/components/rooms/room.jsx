import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { fetchRoom  } from '../../actions/room_actions';
import { joinRoom, leaveRoom } from '../../util/rooms_util';
import * as RoomUtil from '../../util/rooms_util';
import { receiveRoom } from '../../actions/room_actions';
import { receiveGame } from '../../actions/game_actions';
import * as TakingSixUtil from '../../util/game_util';
import * as FrequencyUtil from '../../util/frequency_util';
import GameComponent from '../nomnom/game_component';
import FrequencyGame from '../games/frequency/frequency_game';

const socket = io();

const Room = () => {
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);

  const { code: roomCode } = useParams();
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.entities.rooms);
  
  useEffect(() => {
    socket.emit("join_room", roomCode);
    dispatch(fetchRoom(roomCode));
    return () => {
      socket.emit("leave_room", roomCode);
      socket.removeAllListeners();
    }
  }, []);

  useEffect(()=> {
      socket.on("message", (data) => console.log(data));
      socket.on("receive_message", (data) => {
        setList(list => [...list, data.message]);
      });
      socket.on("user_sits", (room) => dispatch(receiveRoom(room)));
      socket.on("user_leaves", (room) => dispatch(receiveRoom(room)));
      socket.on("game_started", (room) => dispatch(receiveRoom(room)));
      socket.on("game_created", (game) => dispatch(receiveGame(game)));

  },[]);

  const handleCreate = (e) =>{
    switch(rooms[roomCode].game){
      case 'Taking Six':
        TakingSixUtil.createGame(roomCode, rooms[roomCode]?.seatedUsers)
      case 'Frequency':
        const { redTeam, blueTeam } = rooms[roomCode]
        FrequencyUtil.createGame(roomCode, { redTeam, blueTeam })
      default:
        return null;
    }
    // if (rooms[roomCode]?.seatedUsers.length > 1){
    // }
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send_message', { message: message, roomCode: roomCode });
  };
  
  const joinSeat = (e) => {
    e.preventDefault();
    joinRoom(roomCode)
  };

  const leaveSeat = (e) => {
    e.preventDefault();
    leaveRoom(roomCode)
  };

  const joinTeam = (team) => {
    RoomUtil.joinTeam(team)
  }

  const leaveTeam = (team) => {
    RoomUtil.leaveTeam(team)
  }

  const renderGameComponent = () =>{
    switch(rooms[roomCode].game){
      case 'Taking Six':
        return <GameComponent socket={socket} roomCode={roomCode} />
      case 'Frequency':
        return <FrequencyGame socket={socket} roomCode={roomCode} />
      default:
        return null;
    }
  }

  const renderSeatedUsers = () => (
    <div className='chat-users'>
      <div className='users-header'>Seated Users</div>
      <ul className='users-box'>
        {rooms[roomCode]?.seatedUsers.map((user, idx) => <li key={idx}>{user.handle}</li>)}
      </ul>
    </div>
  )

  const renderTeams = () => (
    <div>
      <div>Red Team</div>
      <button className='seat-btn-1' onClick={() => joinTeam('redTeam')}>Join Red</button>
      <button className='seat-btn-2' onClick={() => leaveTeam('redTeam')}>Leave Team</button>
      <ul>
        {rooms[roomCode]?.redTeam.map((user, idx) => <li key={idx}>{user.handle}</li>)}
      </ul>
      <div>Blue Team</div>
      <button className='seat-btn-1' onClick={() => joinTeam('blueTeam')}>Join Blue</button>
      <button className='seat-btn-2' onClick={() => leaveTeam('blueTeam')}>Leave Team</button>
      <ul>
        {rooms[roomCode]?.blueTeam.map((user, idx) => <li key={idx}>{user.handle}</li>)}
      </ul>
    </div>
  )

  const renderSeatButtons = () => (
    rooms[roomCode]?.gameStarted ? 
    <div>
      {renderGameComponent()}
    </div> 
    : 
    <div className='room-page-container'>
      <h1 className='room-title'>In Room {roomCode}</h1>
      <div className='seat-btns'>
        <div className='sit-get-btns'>
          <button className='seat-btn-1' onClick={joinSeat}>Sit</button>
          <button className='seat-btn-2' onClick={leaveSeat}>Get Up</button>
        </div>
        <button className='start-game-btn' onClick={handleCreate}>Start Game</button>
      </div>

      <div className='chat-wrapper'>
        {rooms[roomCode]?.game === "Frequency" ? renderTeams() : renderSeatedUsers()}

        <div className='chat-items'>
          <div className='chat-box'>
            <span>Type a message here: </span>
            <input type="text" onChange={(e) => setMessage(e.target.value)}/>
            <button onClick={sendMessage} >Send</button>
          </div>

          <ul className='chat-area'>
            {list.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

      </div>
    </div>
  )

  return(
    <div>
      {renderSeatButtons()}
    </div>
  );
}

export default Room;