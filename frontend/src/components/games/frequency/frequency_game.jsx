import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGame } from '../../../util/frequency_util';
import { fetchGame, receiveGame } from '../../../actions/frequency_actions';

const FrequencyGame = ({ roomCode, socket }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [leftOrRight, setLeftOrRight] = useState("");
  const [stateQueue, setStateQueue] = useState([]);
  const [clue, setClue] = useState("");
  const [guess, setGuess] = useState(0);
  const gameState = useSelector(state => state.games[roomCode]?.gameState);
  const assets = useSelector(state => state.games[roomCode]?.assets);
  const sessionId = useSelector(state => state.session.user.id);
  const room = useSelector(state => state.entities.rooms[roomCode])
  const redTeam = useSelector(state => state.games[roomCode]?.assets.redTeam)
  const blueTeam = useSelector(state => state.games[roomCode]?.assets.blueTeam)
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
    socket.on('guess_updated',(data) => {
      setGuess(data.guess)
    })
  },[]);

  useEffect(() => {
    if(!isAnimating && stateQueue.length > 0){
      let nextUpdate = stateQueue[0];
      setStateQueue(oldState => oldState.slice(1));
      dispatch(receiveGame(nextUpdate))
    }
  }, [isAnimating])

  useEffect(() => {
    if(!gameState){
      return;
    }
    if(gameState.name === 'PSYCHIC_PHASE'){
      setClue("");
      setGuess(0);
      setLeftOrRight("");
    }
  }, [gameState])

  const updateGuess = (e) => {
    socket.emit("update_guess", { roomCode: roomCode, guess: guess});
  }

  const submitClue = (e) => {
    if (clue === ""){
      return;
    }
    
    handleUpdate(e)
  }

  const chooseLeft = (e) => {
    setLeftOrRight("left")
  }

  const chooseRight = (e) => {
    setLeftOrRight("right")
  }

  const renderClueForm = () => {
    let teams = redTeam.concat(blueTeam)
    let psychic = teams.find(player => player.isPsychic === true);
    if(sessionId === psychic._id && psychic.activePlayer){
      return(
        <form onSubmit={submitClue}>
          <input type="text" onChange={(e) => setClue(e.target.value)}/>
        </form>
      )
    }
  }

  const renderSliderAndConfirm = () => {
    let teams = redTeam.concat(blueTeam)
    let currentPlayer = teams.find(player => player._id === sessionId);
    if(currentPlayer.activePlayer && gameState.name === 'TEAM_PHASE'){
      return(
        <div>
          <input type="range" min="-90" max="90" value={guess} onChange={changeSlider} onMouseUp={updateGuess}/>
          <button onClick={handleUpdate}>Confirm Guess</button>
        </div>
      )
    }
  }

  const renderLeftOrRight = () => {
    let teams = redTeam.concat(blueTeam)
    let currentPlayer = teams.find(player => player._id === sessionId);
    if(currentPlayer.activePlayer && gameState.name === 'LEFT_RIGHT_PHASE'){
      if(leftOrRight === ""){
        return(
          <div>
            <button onClick={chooseLeft}>Left</button>
            <button onClick={chooseRight}>Right</button>
          </div>
        )
      } else {
        return (
          <div>
            <button onClick={handleUpdate}>Confirm</button>
            <button onClick={()=> setLeftOrRight("")}>Cancel</button>
          </div>
        )
      }
      
    }
  }

  const changeSlider = (e) => {
    setGuess(e.target.value);
  }
  
  const handleUpdate = (e) => {
    // e.preventDefault();
    const payload = {
      action: gameState.actions[0],
      clue: clue,
      guess: guess,
      leftOrRight: leftOrRight
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
            <li>local guess: {guess}</li>
            <li>db guess: {assets.guess}</li>
            <li>leftOrRight: {assets.leftOrRight}</li>
          </ul>
          <div>Game State</div>
          <ul>
            <li>{gameState.name}</li>
            <li>{gameState.type}</li>
            {gameState.actions.map((action, idx) => <li key={idx}>action: {action}</li>)}
            {Object.keys(gameState.transitions).map((transition, idx) => <li key={idx}>transition: {transition}</li>)}
          </ul>

          <ul>
            <li>Red Team</li>
            {room && room.redTeam.map(player => <li>{player.handle}</li>)}
          </ul>

          <ul>
            <li>Blue Team</li>
            {room && room.blueTeam.map(player => <li>{player.handle}</li>)}
          </ul>

          {renderClueForm()}  
          {renderSliderAndConfirm()}   
          {renderLeftOrRight()}
        </div>
      );
  }
}

export default FrequencyGame;