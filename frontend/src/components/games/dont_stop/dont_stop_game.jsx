import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGame } from '../../../util/dont_stop_util';
import { fetchGame, receiveGame } from '../../../actions/dont_stop_actions';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import MessageItem from '../../taking_six/message_item';

const DontStopGame = ({ roomCode, socket, setMessage, sendMessage, list, message }) => {
  const gameState = useSelector(state => state.games[roomCode]?.gameState);
  const assets = useSelector(state => state.games[roomCode]?.assets);
  const [isDelayed, setIsDelayed] = useState(false);
  const [stateQueue, setStateQueue] = useState([]);
  const [timers, setTimers] = useState([]);
  const timerRef = useRef(timers);

  const [routes, setRoutes] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGame(roomCode));
    socket.on('game_updated', (game) => {
      setStateQueue(oldState =>  [...oldState, game])
    });

    return () => {
      timerRef.current.forEach(timer => clearTimeout(timerRef));
    }
  },[]);

  useEffect(() => {
    if(!isDelayed && stateQueue.length > 0){
      let nextUpdate = stateQueue[0];
      if(nextUpdate.gameState.type === 'automated') {
        setIsDelayed(true)


        const timer = setTimeout(() => {
          setStateQueue(oldState => oldState.slice(1));
          dispatch(receiveGame(nextUpdate))
          setIsDelayed(false)
          setTimers(oldState => oldState.slice(1));
        }, 2000);

        setTimers(oldState => [...oldState, timer]);

        // Need to clearTimeout but it's being called on every rerender
      } else {
        setStateQueue(oldState => oldState.slice(1));
        dispatch(receiveGame({ gameState: nextUpdate.gameState, assets: nextUpdate.assets }))
      }
    } 
  }, [stateQueue, isDelayed])

  const handleUpdate = (e) => {
    // e.preventDefault();
    const payload = {
      action: gameState.actions[0],
      routes: JSON.parse(routes)
    };
    updateGame(roomCode, payload)
      .catch(err => console.error(err))
  };

  if(gameState && assets){
    return(
      <div>
        <h2>Board</h2>
        <ul>
          {Object.entries(assets.board).map((route) => <li>{Object.keys(route[1].players).map(color => <div>{route[0]} - {color}: {route[1].players[color]}</div>)}</li> )}
        </ul>
        <br />
        <ul>
          Assets:
          <li>Dice: {assets.dice}</li>
          <li>Turn Count: {assets.turnCounter}</li>
          <li>Routes: {JSON.stringify(assets.routes)}</li>
          <li>pairs: {JSON.stringify(assets.pairs)}</li>
          <li>currentRun: {JSON.stringify(assets.currentRun)}</li>


        </ul>
        <br />
        <ul>
          GameState:
          <li>State Name: {gameState.name}</li>
          <li>Actions: {Object.values(gameState.actions).map(action => <div>{action}</div>)}</li>
          <li>transitions: {Object.keys(gameState.transitions).map(transition => <div>{transition}</div>)}</li>
          <li>type: {gameState.type}</li>
        </ul>


        <input type="text" onChange={(e) => setRoutes(e.target.value)} />
        <button onClick={handleUpdate}>Update</button>
      </div>
    )
  }

}

export default DontStopGame;