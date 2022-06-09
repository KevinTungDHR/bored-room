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
import * as DontStopUtil from '../../util/dont_stop_util';
import FrequencyGame from '../games/frequency/frequency_game';
import GameComponent from '../taking_six/game_component';
import DontStopGame from '../games/dont_stop/dont_stop_game';

const socket = io();

const Room = () => {
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const [roomError, setRoomError] = useState('');

  const { code: roomCode } = useParams();
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.entities.rooms);
  const currentUser = useSelector(state => state.session.user);
  
  useEffect(() => {
    socket.emit("join_room", roomCode);
    dispatch(fetchRoom(roomCode));
    return () => {
      socket.emit("leave_room", roomCode);
      socket.removeAllListeners();
    }
  }, []);

  useEffect(()=> {
      socket.on("receive_message", (message) => {
        setList(list => [...list, message]);
      });
      socket.on("user_sits", (room) => dispatch(receiveRoom(room)));
      socket.on("user_leaves", (room) => dispatch(receiveRoom(room)));
      socket.on("game_started", (room) => dispatch(receiveRoom(room)));
      socket.on("game_created", (game) => dispatch(receiveGame(game)));

  },[]);

  const handleCreate = (e) =>{
    if (rooms[roomCode].creator._id !== currentUser._id){
      setRoomError("Only the host can start the game")
      return;
    }

    switch(rooms[roomCode].game){
      case 'Taking Six':
        if (rooms[roomCode]?.seatedUsers.length < 2){
          setRoomError("This game requires at least two players. Please try our demo instead.")
          return;
        }

        if (rooms[roomCode]?.seatedUsers.length > 10){
          setRoomError("This game only supports 10 players. Please try Frequency instead.")
          return;
        }

        TakingSixUtil.createGame(roomCode, rooms[roomCode]?.seatedUsers);
        break;
      case 'Frequency':
        const { redTeam, blueTeam } = rooms[roomCode]
        if (redTeam.length < 2 || blueTeam.length < 2){
          setRoomError("This game requires at least two players on each team. Please try our demo instead.")
          return;
        }

        FrequencyUtil.createGame(roomCode, { redTeam, blueTeam })
        break;

      case 'Dont Stop':
        if (rooms[roomCode]?.seatedUsers.length < 2){
          setRoomError("This game requires at least two players. Please try our demo instead.")
          return;
        }

        if (rooms[roomCode]?.seatedUsers.length > 4){
          setRoomError("This game only supports 4 players. Please try another game instead.")
          return;
        }

        DontStopUtil.createGame(roomCode, rooms[roomCode]?.seatedUsers);
        break;
      default:
        return null;
    }
 
    setRoomError("")
  }

  const handleCreateDemo = (e) => {
    if (rooms[roomCode].creator._id !== currentUser._id){
      setRoomError("Only the host can start the game")
      return;
    }

    switch(rooms[roomCode].game){
      case 'Taking Six':
        TakingSixUtil.createDemo(roomCode, rooms[roomCode]?.seatedUsers);
        break;
      case 'Frequency':
        const { redTeam, blueTeam } = rooms[roomCode]
        FrequencyUtil.createDemo(roomCode, { redTeam, blueTeam })
        break;
      case 'Dont Stop':
        DontStopUtil.createDemo(roomCode, rooms[roomCode]?.seatedUsers);
        break;
      default:
        return null;
    }

    setRoomError("")
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send_message', { user: currentUser, body: message, roomCode: roomCode });
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
        return <GameComponent socket={socket} room={rooms[roomCode]} roomCode={roomCode} list={list} setMessage={setMessage} sendMessage={sendMessage} message={message}/>
      case 'Frequency':
        return <FrequencyGame socket={socket} room={rooms[roomCode]} roomCode={roomCode} list={list} setMessage={setMessage} sendMessage={sendMessage} message={message}/>
      case 'Dont Stop':
        return <DontStopGame socket={socket} room={rooms[roomCode]} roomCode={roomCode} list={list} setMessage={setMessage} sendMessage={sendMessage} message={message}/>
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
          {!rooms[roomCode]?.teamGame ? 
          <div>
            <button className='seat-btn-1' onClick={joinSeat}>Sit</button>
            <button className='seat-btn-2' onClick={leaveSeat}>Get Up</button>
          </div> : <div></div>
          }
        </div>
        <button className='start-game-btn' onClick={handleCreate}>Start Game</button>
        <button className='start-game-btn' onClick={handleCreateDemo}>Start Demo</button>
        {roomError !== "" && <div className='room-errors'>{roomError}</div>}
      </div>

      <div className='chat-wrapper'>
        {rooms[roomCode]?.teamGame ? renderTeams() : renderSeatedUsers()}

        <div className='chat-items'>
          <form onSubmit={sendMessage} className='chat-box'>
            <span>Type a message here: </span>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
            <input type="submit" value="Send"/>
          </form>

          <ul className='chat-area'>
            {list.map((message, idx) => <li key={idx}>{`${message.user.handle}: ${message.body}`}</li>)}
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