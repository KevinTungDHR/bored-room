import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGame } from '../../../util/frequency_util';
import { fetchGame, receiveGame } from '../../../actions/frequency_actions';

const FrequencyGame = ({ roomCode, socket }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [stateQueue, setStateQueue] = useState([]);
  const gameState = useSelector(state => state.games[roomCode]?.gameState);
  const assets = useSelector(state => state.games[roomCode]?.assets);
  const sessionId = useSelector(state => state.session.user.id);
  const player = useSelector(state => state.games[roomCode]?.assets?.players?.filter(p => p._id === sessionId)[0])
  const redTeam = useSelector(state => state.entities.rooms[roomCode].redTeam?.map(user => user.handle))
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGame(roomCode));
    socket.on('game_updated', (game) => {
      if(stateQueue.length !== 0 || isAnimating){
        setStateQueue(oldState => [...oldState, game])
      } else {
        dispatch(receiveGame(game))
      }
    });
  },[]);

  useEffect(() => {
    if(!isAnimating && stateQueue.length > 0){
      let nextUpdate = stateQueue[0];
      setStateQueue(oldState => oldState.slice(1));
      dispatch(receiveGame(nextUpdate))
    }
  }, [isAnimating])

  const handleUpdate = (e) => {
    // e.preventDefault();
    const payload = {
      action: gameState.actions[0],
    };
    updateGame(roomCode, payload)
      .then(data => console.log(data))
      .catch(err => console.error(err))
  };

    if (gameState) {
      return (
        <div>
          <div>Game Assets</div>
          <ul>
            <li>Active Team: {assets.activeTeam}</li>
            <li>Blue Points: {assets.bluePoints}</li>
            <li>Red Points: {assets.redPoints}</li>
            <li>Current Card: Left: {assets.currentCard.left} | Right: {assets.currentCard.right} </li>
            <li>clue: {assets.clue}</li>
            <li>dial: {assets.dial}</li>
            <li>guess: {assets.guess}</li>
            <li>leftOrRight: {assets.leftOrRight}</li>
          </ul>
          <div>Game State</div>
          <ul>
            <li>{gameState.name}</li>
            <li>{gameState.type}</li>
            {gameState.possibleActions.map((action, idx) => <li key={idx}>action: {action}</li>)}
            {Object.keys(gameState.transitions).map((transition, idx) => <li key={idx}>transition: {transition}</li>)}
          </ul>
        </div>
      );
  }
}

export default FrequencyGame;
