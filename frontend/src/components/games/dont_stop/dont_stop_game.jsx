import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGame } from '../../../util/dont_stop_util';
import { fetchGame, receiveGame } from '../../../actions/dont_stop_actions';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { AiFillStar, AiOutlineCheckCircle } from 'react-icons/ai';
import MessageItem from '../../taking_six/message_item';
import Die from './die';

const DontStopGame = ({ roomCode, socket, room, setMessage, sendMessage, list, message }) => {
  const [action, setAction] = useState("");
  const [route, setRoute] = useState([]);
  const gameState = useSelector(state => state.games[roomCode]?.gameState);
  const assets = useSelector(state => state.games[roomCode]?.assets);
  const [isDelayed, setIsDelayed] = useState(false);
  const [stateQueue, setStateQueue] = useState([]);
  const [timers, setTimers] = useState([]);
  const timerRef = useRef(timers);
  const chatEndRef = useRef();
  const instructionsRef = useRef();
  const sessionId = useSelector(state => state.session.user._id)
  const currentUser = useSelector(state => state.session.user);
  const users = useSelector(state => state.entities.users)
  const allUsers = useSelector(state => state.entities.rooms[roomCode].seatedUsers);

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
      if((gameState.name !== 'CLIMB_PHASE' && nextUpdate.gameState.name !== 'END_TURN') 
      && (gameState.type === 'automated')) {
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

  useEffect(() => {
    if(!gameState){
      return;
    }

    if(gameState.name === 'END_TURN'){
      setAction("");
      setRoute([]);
    }

  }, [gameState])

  useEffect(() => {
    if(!chatEndRef.current){
      return;
    }
    chatEndRef.current.scrollIntoView({block: 'nearest'})
  }, [list])

  useEffect(() => {
    if(action === ''){
      return;
    }

    if(gameState === 'DICE_REVEAL' && route === []){
      return;
    }

    handleUpdate()
  }, [action, route])

  const handleMessageSubmit = (e) => {
    if(message.trim().length === 0){
      return;
    }

    if(e.keyCode === 13){
      sendMessage(e)
    }
  }

  const handleHowToPlayer = (e) =>{
    instructionsRef.current.scrollIntoView({behavior: "smooth", block: 'nearest'})
  }

  const renderClimbPhaseButtons = () => {
    if(gameState.name === "CLIMB_PHASE"){
      return(
        <div className='climb-phase-button-container'>
          <div className='dont-stop-button' onClick={() => setAction('continue')}>Continue</div>
          <div className='dont-stop-button grey' onClick={() => setAction('stopClimb')}>End Climb</div>
        </div>
      )
    } 
  }

  const renderRouteButtons = () => {
    if(gameState.name === 'DICE_REVEAL' || gameState.name === 'FAIL_CLIMB'){
      return(
        Object.values(assets.routes).map((route, idx) => {
          if(route.length === 0) {
            return (
              <div className='climb-action-container'>
                  <div className='dice-container'>
                    {assets.pairs[idx].map(dicePair => {
                        return (
                          <div className='dice-pair'>
                            <Die value={dicePair[0]}/>
                            <Die value={dicePair[1]}/>
                          </div>
                        )
                      })}
                  </div>
                <div>Not possible</div>
              </div>
            )
          } else if(Array.isArray(route[0])){
            return (
                <div className='climb-action-container'>
                  <div className='dice-container'>
                    {assets.pairs[idx].map(dicePair => {
                        return (
                          <div className='dice-pair'>
                            <Die value={dicePair[0]}/>
                            <Die value={dicePair[1]}/>
                          </div>
                        )
                      })}
                  </div>
                  {route.map(single => 
                    single.length === 0 ? null : <div className='dont-stop-button' onClick={() => handleClimb([single[0]])}>{`Climb on ${single[0]}`}</div>
                  )}
                </div>
            )
          } else if (route.length === 2){
            return(
              <div className='climb-action-container'>
               <div className='dice-container'>
                    {assets.pairs[idx].map(dicePair => {
                        return (
                          <div className='dice-pair'>
                            <Die value={dicePair[0]}/>
                            <Die value={dicePair[1]}/>
                          </div>
                        )
                      })}
                  </div>
                <div className='dont-stop-button' onClick={() => handleClimb(route)}>{`Climb on ${route[0]} and ${route[1]}`}</div>
              </div>
            )
          } else {
            return(
              <div className='climb-action-container'>
                <div className='dice-container'>
                    {assets.pairs[idx].map(dicePair => {
                        return (
                          <div className='dice-pair'>
                            <Die value={dicePair[0]}/>
                            <Die value={dicePair[1]}/>
                          </div>
                        )
                      })}
                  </div>
                <div className='dont-stop-button' onClick={() => handleClimb(route)}>{`Climb on ${route[0]}`}</div>
              </div>
            )
          }
        })
      )
    }
  }

  const handleClimb = (route) => {
    setRoute(route);
    setAction('chooseDice')
  }

  const handleUpdate = (e) => {
    // e.preventDefault();
    const payload = {
      action: action,
      routes: route
    };

    updateGame(roomCode, payload)
      .catch(err => console.error(err))
  };

  if(gameState && assets){
    const currentPlayerId = assets.players.filter(p => p.color === assets.currentPlayer)[0]._id
    const winnerId = assets.gameOver ? assets.players.filter(p => p.color === assets.winner)[0]._id : null
    const winner = winnerId ? users[winnerId] : null
    const currentPlayer = users[currentPlayerId];
    const moveDescription = {
      "DICE_REVEAL": `${currentPlayer.handle} must choose which ropes to climb`,
      "CLIMB_PHASE": `${currentPlayer.handle} must choose to continue or stop`,
      "FAIL_CLIMB": `${currentPlayer.handle} busts! No possible moves`,
      "END_TURN": "Calculating...",
      "GAME_END": `Game Over: ${winner?.handle} wins`
    }
    return(
      <div className='game-background'>
        <div className='dont-stop-game-container'>
          <div className='dont-stop-board-container'>
            <div className='mountain-background'>
              <div className='rope-container'>
                <div className='rope rope-size-3'>
                  {!assets.board[2].completed && Object.keys(assets.board[2].players).map((color, idx) => (
                    assets.board[2].players[color] === 0 ? null : <div className='player-marker' style={{
                        backgroundColor: `${color}`,
                        bottom: `${((assets.board[2].players[color] - 1) * 53 + ((assets.board[2].players[color] - 1) * 2)) - 5}px`,
                        right: `${-10 - (4 * idx)}px`
                      }}></div>)
                  )}

                  {assets.board[2].completed && [...Array(3)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[2].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(2) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[2] - 1) * 53 + ((assets.currentRun[2] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}

                  <div className='rope-top'>2</div>
                  <div className='marker'>2</div>
                  <div className='marker'>2</div>
                </div>
                <div className='rope rope-size-5'>
                  {!assets.board[3].completed && Object.keys(assets.board[3].players).map((color, idx) => (
                    assets.board[3].players[color] === 0 ? null : <div className='player-marker' style={{
                        backgroundColor: `${color}`,
                        bottom: `${((assets.board[3].players[color] - 1) * 53 + ((assets.board[3].players[color] - 1) * 2)) - 5}px`,
                        right: `${-10 - (4 * idx)}px`
                      }}></div>)
                  )}

                  {assets.board[3].completed && [...Array(5)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[3].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(3) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[3] - 1) * 53 + ((assets.currentRun[3] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}
                  <div className='rope-top'>3</div>
                  <div className='marker'>3</div>
                  <div className='marker'>3</div>
                  <div className='marker'>3</div>
                  <div className='marker'>3</div>
                </div>
                <div className='rope rope-size-7'>
                  {!assets.board[4].completed && Object.keys(assets.board[4].players).map((color, idx) => (
                      assets.board[4].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[4].players[color] - 1) * 53 + ((assets.board[4].players[color] - 1) * 2)) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                    )}

                    {assets.board[4].completed && [...Array(7)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[4].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}

                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(4) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[4] - 1) * 53 + ((assets.currentRun[4] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}
                  <div className='rope-top'>4</div>
                  <div className='marker'>4</div>
                  <div className='marker'>4</div>
                  <div className='marker'>4</div>
                  <div className='marker'>4</div>
                  <div className='marker'>4</div>
                  <div className='marker'>4</div>
                </div>
                <div className='rope rope-size-9'>
                  {!assets.board[5].completed && Object.keys(assets.board[5].players).map((color, idx) => (
                      assets.board[5].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[5].players[color] - 1) * 53 + ((assets.board[5].players[color] - 1) * 2)) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                   {assets.board[5].completed && [...Array(9)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[5].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}

                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(5) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[5] - 1) * 53 + ((assets.currentRun[5] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}
                  <div className='rope-top'>5</div>
                  <div className='marker'>5</div>
                  <div className='marker'>5</div>
                  <div className='marker'>5</div>
                  <div className='marker'>5</div>
                  <div className='marker'>5</div>
                  <div className='marker'>5</div>
                  <div className='marker'>5</div>
                  <div className='marker'>5</div>
                </div>
                <div className='rope rope-size-11'>
                  {!assets.board[6].completed && Object.keys(assets.board[6].players).map((color, idx) => (
                      assets.board[6].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[6].players[color] - 1) * 53 + ((assets.board[6].players[color] - 1) * 2)) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                  {assets.board[6].completed && [...Array(11)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[6].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}

                  {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(6) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[6] - 1) * 53 + ((assets.currentRun[6] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}
                  <div className='rope-top'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                  <div className='marker'>6</div>
                </div>
                <div className='rope rope-size-13'>
                {!assets.board[7].completed && Object.keys(assets.board[7].players).map((color, idx) => (
                    assets.board[7].players[color] === 0 ? null : <div className='player-marker' style={{
                        backgroundColor: `${color}`,
                        bottom: `${((assets.board[7].players[color] - 1) * 53 + ((assets.board[7].players[color] - 1) * 2)) - 5}px`,
                        right: `${-10 - (4 * idx)}px`
                      }}></div>)
                  )}

                {assets.board[7].completed && [...Array(13)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[7].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}

                  {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(7) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[7] - 1) * 53 + ((assets.currentRun[7] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}

                
                  <div className='rope-top'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                  <div className='marker'>7</div>
                </div>
                <div className='rope rope-size-11'>
                  {!assets.board[8].completed && Object.keys(assets.board[8].players).map((color, idx) => (
                      assets.board[8].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[8].players[color] - 1) * 53 + ((assets.board[8].players[color] - 1) * 2)) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                    {assets.board[8].completed && [...Array(11)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[8].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}

                  {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(8) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[8] - 1) * 53 + ((assets.currentRun[8] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}

                  <div className='rope-top'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                  <div className='marker'>8</div>
                </div>
                <div className='rope rope-size-9'>
                  {!assets.board[9].completed && Object.keys(assets.board[9].players).map((color, idx) => (
                      assets.board[9].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[9].players[color] - 1) * 53 + ((assets.board[9].players[color] - 1) * 2)) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                {assets.board[9].completed && [...Array(9)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[9].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}
                  
                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(9) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[9] - 1) * 53 + ((assets.currentRun[9] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}
                  <div className='rope-top'>9</div>
                  <div className='marker'>9</div>
                  <div className='marker'>9</div>
                  <div className='marker'>9</div>
                  <div className='marker'>9</div>
                  <div className='marker'>9</div>
                  <div className='marker'>9</div>
                  <div className='marker'>9</div>
                  <div className='marker'>9</div>
                </div>
                <div className='rope rope-size-7'>
                  {!assets.board[10].completed && Object.keys(assets.board[10].players).map((color, idx) => (
                      assets.board[10].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[10].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                  {assets.board[10].completed && [...Array(7)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[10].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}

                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(10) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[10] - 1) * 53 + ((assets.currentRun[10] - 1) * 2)) - 5}px`,
                          right: `-7px`
                        }}></div>: null}
                  <div className='rope-top'>10</div>
                  <div className='marker'>10</div>
                  <div className='marker'>10</div>
                  <div className='marker'>10</div>
                  <div className='marker'>10</div>
                  <div className='marker'>10</div>
                  <div className='marker'>10</div>
                </div>
                <div className='rope rope-size-5'>
                  {!assets.board[11].completed && Object.keys(assets.board[11].players).map((color, idx) => (
                      assets.board[11].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[11].players[color] - 1) * 53 + ((assets.board[11].players[color] - 1) * 2)) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                  {assets.board[11].completed && [...Array(5)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[11].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(11) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[11] - 1) * 53 + ((assets.currentRun[11] - 1) * 2)) - 5}px`,
                          right: `-14px`
                        }}></div>: null}
                  <div className='rope-top'>11</div>
                  <div className='marker'>11</div>
                  <div className='marker'>11</div>
                  <div className='marker'>11</div>
                  <div className='marker'>11</div>
                </div>
                <div className='rope rope-size-3'>
                  {!assets.board[12].completed && Object.keys(assets.board[12].players).map((color, idx) => (
                      assets.board[12].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[12].players[color] - 1) * 53 + ((assets.board[12].players[color] - 1) * 2)) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                  {assets.board[12].completed && [...Array(3)].map((_, idx) => (
                      <div className='player-marker' style={{
                          backgroundColor: `${assets.board[12].color}`,
                          bottom: `${((idx) * 53) + ((idx * 2)) - 5}px`,
                          right: `${-7}px`
                        }}></div>)
                  )}

                  {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(12) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[12] - 1) * 53 + ((assets.currentRun[12] - 1) * 2)) - 5}px`,
                          right: `-14px`
                        }}></div>: null}
                  <div className='rope-top'>12</div>
                  <div className='marker'>12</div>
                  <div className='marker'>12</div>
                </div>
              </div>
            </div>
            
          </div>

          <div className='dont-stop-action-container'>
            <h2 className='dont-stop-move-description'>{moveDescription[gameState.name]}</h2>
            {currentPlayerId === sessionId && renderClimbPhaseButtons()}
            {currentPlayerId === sessionId && renderRouteButtons()}
          </div>

          <div className='dont-stop-right-container'>
                <div className='scoreboard-container'>
                  <div>
                    <h1>Players</h1>
                    <div className='player-container'>
                      <div>
                        {allUsers.map((user, idx) => {
                          let color = assets.players.filter(player => player._id === user._id)[0].color
                          return (
                            <div key={idx} className='player-handles'>
                              {color === assets.currentPlayer ? <AiOutlineCheckCircle className='chosen-indicator' /> : <span></span> }
                              {user.handle}
                            </div>
                          )
                        })}
                      </div>
                      <div className='player-scores'>
                        {allUsers.map((user, idx) => {
                          let color = assets.players.filter(player => player._id === user._id)[0].color
                          let score = Object.values(assets.board).filter(route => route.completed && route.color === color).length
                          return <div key={idx} className='player-stats'>
                              <div>{score}</div>
                              <AiFillStar className="ai-star-icon" />
                            </div>
                        })}
                      </div>
                    </div>
                  </div>
                </div>
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
                <div className='howToPlay-btn-container'>
                  <div className='howToPlay-btn' onClick={handleHowToPlayer}>How To Play</div>
                </div>
              </div>                
          </div>

          <div className='taking-six-instructions'>
                  <div>
                    <h1>Don't Stop Rules</h1>
                  </div>
                  <div className='taking-six-instructions-setup'>
                    <h2>Overview:</h2>
                    <p>During each turn the active player rolls 4 dice and creates 2 pairs of dice to determine which ropes they wish to climb. While you can climb any ropes you want you are only given 3 climbers per turn, so that you can only climb 3 different ropes each turn. Once a player reaches the top of a rope and end their turn that rope belongs to them and no other players can climb it.</p>
                  </div>
                  <div>
                    <h2>Objective:</h2>
                    <p>Be the first player to reach the top of 3 ropes!</p>
                  </div>
                  <div>
                    <ol className='taking-six-instructions-list'>
                      <h2>Game Play:</h2>
                      <li type="1">The active player rolls 4 dice. There are 3 possible combinations that can be created with those four dice. The active player chooses which combination to use in order to climb up the corresponding rope number.</li>
                      <li type="1">After choosing a rope to climb the active player places their black climber-marker on the rope starting either at the bottom or the space above where they last left off.</li>
                      <li type="1">The active player may then choose to continue or end their climb safely. Ending their climb allows the player to replace the black climber-markers with their colored markers and save their place on the rope.</li>
                      <li type="1">If a player continues they roll another 4 dice and repeat the above steps. However, if they continue and no ropes are climbable combinations of dice they rolled their turn ends and any progress they made with their black climber-markers is lost.</li>
                      <li type="1">When a player reaches the top of a rope and ends their turn, they claim that rope for themselves. No players may climb that rope.</li>
                      <li type="1">When the active player ends their climb the next player takes their turn.</li>
                    </ol>
                  </div>
                  <div>
                    <h2>Game End:</h2>
                    <p>The game ends when one player has reached the top of 3 ropes safely.</p>
                  </div>
                  <div ref={instructionsRef}></div>
                </div>
          
        {/* <ul>
          {Object.entries(assets.board).map((route) => <li>{Object.keys(route[1].players).map(color => <div>{route[0]} - {color}: {route[1].players[color]}</div>)}</li> )}
        </ul>
        <br />
      
        <ul>
          Assets:
          <li>Dice: {assets.dice.map((val,idx)=> <Die value={val} key={idx}/>)}</li>
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
        </ul> */}
      </div>
    )
  }

}

export default DontStopGame;