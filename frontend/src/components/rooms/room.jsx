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
import FrequencyGame from '../games/frequency/frequency_game';
import GameComponent from '../taking_six/game_component';

const socket = io();

const Room = () => {
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);

  const { code: roomCode } = useParams();
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.entities.rooms);
  const currentUserHandle = useSelector(state => state.session.user.handle);
  
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
        let message = `${data.user}: ${data.message}`
        setList(list => [...list, message]);
      });
      socket.on("user_sits", (room) => dispatch(receiveRoom(room)));
      socket.on("user_leaves", (room) => dispatch(receiveRoom(room)));
      socket.on("game_started", (room) => dispatch(receiveRoom(room)));
      socket.on("game_created", (game) => dispatch(receiveGame(game)));

  },[]);

  const handleCreate = (e) =>{
    switch(rooms[roomCode].game){
      case 'Taking Six':
        TakingSixUtil.createGame(roomCode, rooms[roomCode]?.seatedUsers);
        break;
      case 'Frequency':
        const { redTeam, blueTeam } = rooms[roomCode]
        FrequencyUtil.createGame(roomCode, { redTeam, blueTeam })
        break;
      default:
        return null;
    }
    // if (rooms[roomCode]?.seatedUsers.length > 1){
    // }
  }

  const handleCreateDemo = (e) => {
    switch(rooms[roomCode].game){
      case 'Taking Six':
        TakingSixUtil.createDemo(roomCode, rooms[roomCode]?.seatedUsers);
        break;
      case 'Frequency':
        return
      default:
        return null;
    }
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send_message', { user: currentUserHandle, message: message, roomCode: roomCode });
    setMessage("");
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
    RoomUtil.joinTeam(roomCode, team)
  }

  const leaveTeam = (team) => {
    RoomUtil.leaveTeam(roomCode, team)
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
    <div className='teams-wrapper'>
      <div className='team-container'>
        <div>
          <h1 className='team-header red'>Red Team</h1>
          <ul>
            {rooms[roomCode]?.redTeam.map((user, idx) => <li className='team-player' key={idx}>{user.handle}</li>)}
          </ul>
        </div>
        <div>
          <button className='join-red-btn' onClick={() => joinTeam('redTeam')}>Join Red</button>
          <button className='leave-btn' onClick={() => leaveTeam('redTeam')}>Leave Team</button>
        </div>
        
      </div>

      <div className='team-container'>
        <div>
          <h1 className='team-header blue'>Blue Team</h1>
          <ul>
            {rooms[roomCode]?.blueTeam.map((user, idx) => <li className='team-player' key={idx}>{user.handle}</li>)}
          </ul>
        </div>

        <div>
          <button className='join-blue-btn' onClick={() => joinTeam('blueTeam')}>Join Blue</button>
          <button className='leave-btn' onClick={() => leaveTeam('blueTeam')}>Leave Team</button>
        </div>
        
      </div>
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
          {rooms[roomCode]?.game === "Taking Six" ? 
          <div>
            <button className='seat-btn-1' onClick={joinSeat}>Sit</button>
            <button className='seat-btn-2' onClick={leaveSeat}>Get Up</button>
          </div> : <div></div>
          }
        </div>
        <button className='start-game-btn' onClick={handleCreate}>Start Game</button>
        <button className='start-game-btn' onClick={handleCreateDemo}>Start Demo</button>
      </div>

      <div className='chat-wrapper'>
        {rooms[roomCode]?.game === "Frequency" ? renderTeams() : renderSeatedUsers()}

        <div className='chat-items'>
          <form onSubmit={sendMessage} className='chat-box'>
            <span>Type a message here: </span>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
            <input type="submit" value="Send"/>
          </form>

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