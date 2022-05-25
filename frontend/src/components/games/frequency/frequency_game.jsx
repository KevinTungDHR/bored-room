import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGame } from '../../../util/frequency_util';
import { fetchGame, receiveGame } from '../../../actions/frequency_actions';
import { motion } from 'framer-motion';
import Dial from './dial';
import { AiOutlineArrowDown } from 'react-icons/ai';

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
  const blueUsers = useSelector(state => state.entities.rooms[roomCode].blueTeam)
  const redUsers = useSelector(state => state.entities.rooms[roomCode].redTeam)
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
    // if(sessionId === psychic._id && psychic.activePlayer){
      return(
        <form onSubmit={submitClue} className="clue-form">
          <input type="text" onChange={(e) => setClue(e.target.value)} placeholder="Enter clue and click confirm..."/>
        </form>
      )
    // }
  }

  const renderSliderAndConfirm = () => {
    let teams = redTeam.concat(blueTeam)
    let currentPlayer = teams.find(player => player._id === sessionId);
    // if(currentPlayer.activePlayer && gameState.name === 'TEAM_PHASE'){
      return(
        <div className='clue-form'>
          <input type="range" min="-90" max="90" value={guess} onChange={changeSlider} onMouseUp={updateGuess}/>
          <button className='freq-confirm-btn' onClick={handleUpdate}>Confirm</button>
        </div>
      )
    // }
  }

  const renderLeftOrRight = () => {
    let teams = redTeam.concat(blueTeam)
    let currentPlayer = teams.find(player => player._id === sessionId);
    // if(currentPlayer.activePlayer && gameState.name === 'LEFT_RIGHT_PHASE'){
      if(leftOrRight === ""){
        return(
          <div>
            <button className='left-right-btn' onClick={chooseLeft}>Left</button>
            <button className='left-right-btn' onClick={chooseRight}>Right</button>
          </div>
        )
      } else {
        return (
          <div>
            <button className='left-right-btn' onClick={handleUpdate}>Confirm</button>
            <button className='cancel-btn' onClick={()=> setLeftOrRight("")}>Cancel</button>
          </div>
        )
      }
      
    // }
  }

  const changeSlider = (e) => {
    setGuess(e.target.value);
  }

  const renderScoreboard = () => {
    debugger
    return (
      <div>
        <div className='freq-scoreboard-container'>
          <div className='team-scores-container'>
            {assets.activeTeam === 'blue' ? <motion.div className='arrow-icon' animate={{y: [-5, 5]}} transition={{yoyo: Infinity}}>
              <AiOutlineArrowDown 
                height="22px" 
                width="22px" 
                className='active-player-arrow'
              /></motion.div> : <div></div>}
            <div className='team-container'>
              <h1 className='blue'>Blue Team</h1>
              <span>{assets.bluePoints}</span>
              <ul>
                {blueUsers.map(player => <li>{player.handle}</li>)}
              </ul>
            </div>
          </div>
          <div className='team-scores-container'>
            {assets.activeTeam === 'red' ? <motion.div className='arrow-icon' animate={{ y: [-5, 5] }} transition={{ yoyo: Infinity }}>
              <AiOutlineArrowDown
                height="22px"
                width="22px"
                className='active-player-arrow'
              /></motion.div> : <div></div>}
            <div className='team-container'>
              <h1 className='red'>Red Team</h1>
              <span>{assets.redPoints}</span>
              <ul>
                {redUsers.map(player => <li>{player.handle}</li>)}
              </ul>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    )
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
      let teams = redTeam.concat(blueTeam);
      let psychic = teams.find(player => player.isPsychic === true);
      return (
          <div className='frequency-outer-div'>
            {assets && blueUsers && renderScoreboard()}

            {(sessionId === psychic._id && psychic.activePlayer) ? <div>{assets.dial}</div> : <div></div>}
            <div className='dial-container'>
              <div className='left-card'>{assets.currentCard.left}</div>
              <div className='semi-circle'></div>
              <div className='right-card'>{assets.currentCard.right}</div>
            </div>

            <div className='forms-container'>
              {renderClueForm()} 
              {renderSliderAndConfirm()}
            </div>

            <div className='temporary'>
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
          </div>
      );
  }
}

export default FrequencyGame;
