import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGame } from '../../../util/frequency_util';
import { fetchGame, receiveGame } from '../../../actions/frequency_actions';
import DialCanvas from './dial_canvas';
import { motion } from 'framer-motion';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import MessageItem from '../../taking_six/message_item';

const FrequencyGame = ({ roomCode, socket, setMessage, sendMessage, list, message }) => {
  const [leftOrRight, setLeftOrRight] = useState("");
  const [clue, setClue] = useState("");
  const [guess, setGuess] = useState(90);
  const [isDelayed, setIsDelayed] = useState(false);
  const [stateQueue, setStateQueue] = useState([]);
  const [timers, setTimers] = useState([]);
  const timerRef = useRef(timers);
  const gameState = useSelector(state => state.games[roomCode]?.gameState);
  const assets = useSelector(state => state.games[roomCode]?.assets);
  const currentUser = useSelector(state => state.session.user);
  const sessionId = useSelector(state => state.session.user._id);
  const room = useSelector(state => state.entities.rooms[roomCode])
  const blueUsers = useSelector(state => state.entities.rooms[roomCode].blueTeam)
  const redUsers = useSelector(state => state.entities.rooms[roomCode].redTeam)
  const redTeam = useSelector(state => state.games[roomCode]?.assets.redTeam)
  const blueTeam = useSelector(state => state.games[roomCode]?.assets.blueTeam) 
  const chatEndRef = useRef();

  let selectionMade = false;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGame(roomCode));
    socket.on('game_updated', (game) => {
      setStateQueue(oldState =>  [...oldState, game])
    });
   
    socket.on('guess_updated',(data) => {
      setGuess(data.guess)
    })
    socket.on('selection_updated', (data) => {
      setLeftOrRight(data.leftOrRight)
    })

    return () => {
      timerRef.current.forEach(timer => clearTimeout(timerRef));
    }
  },[]);

  useEffect(() => {
    if(!isDelayed && stateQueue.length > 0){
      let nextUpdate = stateQueue[0];
      if(nextUpdate.assets.demoGame && nextUpdate.botTurn) {
        setIsDelayed(true)
       
        const timer = setTimeout(() => {
          setStateQueue(oldState => oldState.slice(1));
          dispatch(receiveGame({ gameState: nextUpdate.gameState, assets: nextUpdate.assets }))
          if(nextUpdate.gameState.name === 'LEFT_RIGHT_PHASE'){
            setGuess(nextUpdate.assets.guess);
          }
          setIsDelayed(false)
          setTimers(oldState => oldState.slice(1));
        }, 2500);

        setTimers(oldState => [...oldState, timer]);
        // Need to clearTimeout but it's being called on every rerender
      } else {
        setStateQueue(oldState => oldState.slice(1));
        dispatch(receiveGame({ gameState: nextUpdate.gameState, assets: nextUpdate.assets }))
      }
    } 
  }, [stateQueue, isDelayed])



  const updateSelection = () => {
    socket.emit("updateSelection", { roomCode: roomCode, leftOrRight: leftOrRight })
  }

  useEffect(() => {
    if(!gameState){
      return;
    }
    if(gameState.name === 'PSYCHIC_PHASE'){
      setClue("");
      setGuess(90);
      setLeftOrRight("");
    }

    if(gameState.name !== 'PSYCHIC_PHASE'){
      setGuess(assets.guess)
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

  useEffect(() => {
    updateSelection()
  }, [leftOrRight])

  const renderClueForm = () => {
    let teams = redTeam.concat(blueTeam)
    let psychic = teams.find(player => player.isPsychic);

    if(sessionId === psychic._id && psychic.activePlayer){
      return(
        <form onSubmit={submitClue} className="clue-form">
          <div>
            <input type="text" onChange={(e) => setClue(e.target.value)} placeholder="Enter a clue..."/>
            <button className='submit-clue' onClick={handleUpdate}>Submit</button>
          </div>
        </form>
      )
    }
  }

  const renderSliderAndConfirm = () => {
    let teams = redTeam.concat(blueTeam)
    let currentPlayer = teams.find(player => player._id === sessionId);
    if(currentPlayer && currentPlayer.activePlayer && gameState.name === 'TEAM_PHASE'){
      return(
        <div>
          <input className='slider' type="range" min="0" max="180" value={guess} onChange={changeSlider} onMouseUp={updateGuess}/>
          <button className='submit-guess' onClick={handleUpdate}>Confirm</button>
        </div>
      )
    }
  }

  const renderLeftOrRight = () => {
    let teams = redTeam.concat(blueTeam)
    let currentPlayer = teams.find(player => player._id === sessionId);
    
    let display;

    if (currentPlayer && currentPlayer.activePlayer && gameState.name === 'LEFT_RIGHT_PHASE') {
      if (leftOrRight === "") {
        display =
          <div className='lt-rt-btns'>
            <button className='left-right-btn' onClick={chooseLeft}>Left</button>
            <button className='left-right-btn' onClick={chooseRight}>Right</button>
          </div>
        selectionMade = false;
      } else {
        display =
          <div className='lt-rt-btns'>
            <button className='left-right-btn' onClick={handleUpdate}>Confirm</button>
            <button className='cancel-btn' onClick={() => setLeftOrRight("")}>Cancel</button>
          </div>
        selectionMade = true;
      }
    }

    return (
      <div>
        {display}
      </div>
    )
    
  }

  const drawDial = (ctx) => {
    ctx.restore()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()
    ctx.translate(315, 350)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 300, Math.PI, 0);
    ctx.lineTo(0, 0);
    ctx.closePath()
    ctx.fillStyle = '#f2efe8'
    ctx.fill();

    const allPlayers = blueTeam.concat(redTeam);
    const player = allPlayers.find(player => player._id === sessionId);

    if (!player || player.isPsychic || assets.dialRevealed) {
      drawTarget(ctx)
    } else {
      drawShield(ctx)
    }
      
    let length = 300;
    let theta = guess;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0 - length * Math.cos(Math.PI * theta/180), 0 - length * Math.sin(Math.PI * theta/180))
    ctx.closePath()
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ac0117';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 50, Math.PI, 0);
    ctx.closePath()
    ctx.lineWidth = 15;
    ctx.fillStyle = '#ac0117';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 300, Math.PI, 0);
    ctx.strokeStyle = '#004b77';
    ctx.stroke();

  }

  const drawShield = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 300, Math.PI, 0);
    ctx.lineTo(0, 0);
    ctx.closePath()
    ctx.fillStyle = '#a7d7ce'
    ctx.fill();
  }

  const drawTarget = (ctx) => {
    const outerArc = { start: Math.PI/180 * (assets.dial - 12 + 180), end: Math.PI/180 * (assets.dial + 12 + 180)}
    const innerArc = { start: Math.PI/180 * (assets.dial - 7 + 180), end: Math.PI/180 * (assets.dial + 7 + 180)}
    const targetArc = { start: Math.PI/180 * (assets.dial - 2 + 180), end: Math.PI/180 * (assets.dial + 2 + 180)}
    ctx.beginPath()
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 300, outerArc.start, outerArc.end)
    ctx.lineTo(0, 0);
    ctx.closePath()
    ctx.fillStyle = '#dea02f';
    ctx.fill();

    ctx.beginPath()
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 300, innerArc.start, innerArc.end)
    ctx.lineTo(0, 0);
    ctx.closePath()
    ctx.fillStyle = '#abd0ab';
    ctx.fill();

    ctx.beginPath()
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 300, targetArc.start, targetArc.end)
    ctx.lineTo(0, 0);
    ctx.closePath()
    ctx.fillStyle = '#e07155';
    ctx.fill();
  }

  const changeSlider = (e) => {
    setGuess(e.target.value);
  }

  const bobbingArrow = (activeTeam) => {
    const currTeam = assets.activeTeam;
    const turnType = gameState.actions[0]; // 'chooseLeftRight'

    const arrow = <motion.div className='arrow-icon' animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity }}>
      <AiOutlineArrowDown
        height="22px"
        width="22px"
        className='active-player-arrow'
      /></motion.div>

    if (activeTeam === currTeam && turnType !== "chooseLeftRight") {
      return arrow;
    } else if (activeTeam !== currTeam && turnType === "chooseLeftRight") {
      return arrow;
    } else {
      return <div></div>
    }
  }

  const renderScoreboard = () => {
    let allPlayers = blueTeam.concat(redTeam);

    return (
      <div className='scoreboard-outermost-div'>
        <div className='freq-scoreboard-container'>
          <div className='scoreboard-background'></div>
          <div className='team-scores-container'>
            {bobbingArrow("blue")}
            <div className='team-container'>
              <h1 className='blue'>Blue Team</h1>
              <span>{assets.bluePoints}</span>
              <ul>
                {blueUsers.map(player => <li className='handle-li'>
                  <AiOutlineCheckCircle height="16px" width="16px" className={allPlayers.find(play => player._id === play._id).activePlayer && gameState.name !== "REVEAL_PHASE"
                     ? "active-check" : "hidden"} />
                  {player.handle}</li>)}
              </ul>
            </div>
          </div>
          <div className='team-scores-container'>
            {/* CHANGE ASSETS.ACTIVETEAM TO THE ACTIVEPLAYER'S TEAM */}
            {bobbingArrow("red")}
            <div className='team-container'>
              <h1 className='red'>Red Team</h1>
              <span>{assets.redPoints}</span>
              <ul>
                {redUsers.map(player => <li className='handle-li'>
                  <AiOutlineCheckCircle height="16px" width="16px" className={allPlayers.find(play => player._id === play._id).activePlayer && gameState.name !== "REVEAL_PHASE"
                     ? "active-check" : "hidden"} />{player.handle}</li>)}
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
        <h1>Frequency Rules</h1>
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
          <ol className='frequency-instructions-list'>
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

  const handleMessageSubmit = (e) => {
    if(message.trim().length === 0){
      return;
    }

    if(e.keyCode === 13){
      sendMessage(e)
    }
  }
 
  const handleUpdate = (e) => {
    e.preventDefault();
    const payload = {
      action: gameState.actions[0],
      clue: clue,
      guess: guess,
      leftOrRight: leftOrRight
    };

    updateGame(roomCode, payload)
      .catch(err => console.error(err))
  };

    if (gameState) {
      const allPlayers = blueTeam.concat(redTeam);
      const currentPlayer = allPlayers.find(player => player.activePlayer);
      let playerInGame = allPlayers.find(player => player._id === sessionId)
      let userActive = playerInGame && playerInGame.activePlayer;
      const curPlayerHandle = room.blueTeam.concat(room.redTeam).find(user => user._id === currentPlayer._id).handle;

      const actionDescriptions = {
        "giveClue": `${curPlayerHandle} is thinking of a clue`,
        "makeGuess": `${curPlayerHandle} is making a guess`,
        "chooseLeftRight": `${assets.activeTeam} Team is choosing Left or Right`,
        "scorePoints": "Tallying Points",
        "nextRound": "Reveal Phase"
      }
  
      return (
          <div className='frequency-outer-div'>
            <div className='game-background'>
              <div className='frequency-main'>
                <div className='frequency-left-container'>
                  <h1 className='curr-game-action'>
                    Current Move:<span> {actionDescriptions[gameState.actions[0]]}</span>
                  </h1>
                  {/* {(sessionId === psychic._id && psychic.activePlayer) ? <div className='dial-answer'>Dial: {assets.dial}</div> : <div></div>} */}
                  <div className='dial-container'>
                    <div className='left-card'>{assets.currentCard.left}</div>
                    <DialCanvas className="dial-component" draw={drawDial} width={630} height={350} setGuess={setGuess} updateGuess={updateGuess} allPlayers={allPlayers} gameState={gameState} sessionId={sessionId}/>
                    <div className='right-card'>{assets.currentCard.right}</div>
                  </div>

                  {(assets.clue) ? <div className='clue'>Clue: {assets.clue}</div> : <div></div>}

                  <div className='forms-container'>
                    {renderClueForm()} 
                    {renderSliderAndConfirm()}
                    {renderLeftOrRight()}
                    {(gameState.name === 'REVEAL_PHASE' || gameState.name === 'SCORE_PHASE') && <div className='selected-lt-rt'>Selected: {assets.leftOrRight}</div>}
                    {gameState.name === 'REVEAL_PHASE' && playerInGame && <button className='submit-guess' onClick={handleUpdate}>Next Round</button>}
                    {selectionMade ? <div className='selected-lt-rt'>Selected: {leftOrRight}</div> : ""}
                  </div>
                </div>

                <div className='frequency-right-container'>
                  {assets && blueUsers && renderScoreboard()}

                  <div className='game-component-chat-container'>
                    <header className='game-component-chat-header'>
                      <div>Room: {room.name}</div>
                      <div>Code: {roomCode}</div>
                    </header>
                    <div className='game-component-messages-container'>
                      {list.map((message, idx) => <MessageItem key={idx} message={message} currentUser={currentUser}/>)}
                      <div ref={chatEndRef}></div>
                    </div>
                    <textarea className='game-component-message-input' type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleMessageSubmit}></textarea>
                  </div>
                </div>
              </div>
              

              

              {renderInstructions()}

            </div>
          </div>
      );
  }
}


export default FrequencyGame;