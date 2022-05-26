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
          <div className='lt-rt-btns'>
            <button className='left-right-btn' onClick={chooseLeft}>Left</button>
            <button className='left-right-btn' onClick={chooseRight}>Right</button>
          </div>
        )
      } else {
        return (
          <div className='lt-rt-btns'>
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
    return (
      <div>
        <div className='freq-scoreboard-container'>
          <div className='scoreboard-background'></div>
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
 
  const renderInstructions = () => {
    return (
      <div className='frequency-instructions'>
        <h1>Frequency Rules: </h1>
        <div>
          <h2>Overview: </h2>
          <p>Frequency is a team-based social guessing game that tests how well you understand your teammates --- and how well they understand you.</p>
        </div>

        <div>
          <h2>Objective: </h2>
          <p>When it’s your teams turn, correctly guess where the hidden target zone is based off your Psychic’s clue. When it’s not your teams turn, collectively determine if you think the target zone is to the left or to the right of the opposing teams guess.</p>
        </div>

        <div>
          <h2>Game Play:</h2>
          <ol>
            <li type="1">Each turn a member of a team will take the role of Psychic. </li>
            <li type="1">The active team draws a card and places it in front of the dial.The card will have two opposing ideas, one that represents the leftmost part of the dial and one that represents the rightmost part (such as smells good vs smells bad).</li>
            <li type="1">A target zone on the dial will get randomly chosen and is only visible to the Psychic. </li>
            <li type="1">The Psychic will give a clue such as, “Freshly cut grass”. The clue should be based upon where the target zone lies within the spectrum of the drawn card.</li>
            <li type="1">The active team must then agree upon where they believe the target zone is. For example, where the target is on the spectrum of smells-good to smells bad based on the clue “Freshly cut grass”.</li>
            <li type="1">After the active team has locked in their guess, the opposing team determines if they think the target zone is to the left or to the right of the active team's guess</li>
            <li type="1">Reveal/Score: The target zone is then revealed and the active team will score 2, 3 or 4 points depending on where in the target zone they landed or 0 points if they missed the mark completely. The opposing team gets 1 point if they guessed left or right correctly.</li>
            <li type="1">The opposing team now selects a Psychic and takes their turn. Continue until one team has 10 points.</li>
          </ol>
        </div>

        <div>
          <h2>Bonus Rule: </h2>
          <p>If the active team guesses perfectly (4 points), and they still have fewer points than the opposing team, they get to take another turn, drawing a new card and selecting a new Psychic.</p>
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

          <div className='frequency-header'>
            {renderInstructions()}
            {assets && blueUsers && renderScoreboard()}
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
