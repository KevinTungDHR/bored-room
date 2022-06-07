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
  const currentUser = useSelector(state => state.session.user);
  const allPlayers = useSelector(state => state.games[roomCode]?.assets?.players)
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
      && (nextUpdate.gameState.type === 'automated' || gameState.name === "END_TURN")) {
        setIsDelayed(true)
        console.log("WERE HERE")

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

  const renderClimbPhaseButtons = () => {
    if(gameState.name === "CLIMB_PHASE"){
      return(
        <div>
          <button onClick={() => setAction('continue')}>Continue</button>
          <button onClick={() => setAction('stopClimb')}>End Climb</button>
        </div>
      )
    } 
  }

  const renderRouteButtons = () => {
    if(gameState.name === 'DICE_REVEAL'){
      return(
        Object.values(assets.routes).map((route, idx) => {
          if(route.length === 0) {
            return (
              <div>Not possible</div>
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
                    <button onClick={() => handleClimb([single[0]])}>{`Climb ${single[0]}`}</button>
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
                <button onClick={() => handleClimb(route)}>{`Climb on ${route[0]} and ${route[1]}`}</button>
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
                <button onClick={() => handleClimb(route)}>{`Climb on ${route[0]}`}</button>
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
    return(
      <div className='game-background'>
        <div className='dont-stop-game-container'>
          <div className='dont-stop-board-container'>
            <div className='mountain-background'>
              <div className='rope-container'>
                <div className='rope rope-size-3'>
                {Object.keys(assets.board[2].players).map((color, idx) => (
                    assets.board[2].players[color] === 0 ? null : <div className='player-marker' style={{
                        backgroundColor: `${color}`,
                        bottom: `${((assets.board[2].players[color] - 1) * 53) - 5}px`,
                        right: `${-10 - (4 * idx)}px`
                      }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(2) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[2] - 1) * 53) - 5}px`,
                          right: `-7px`
                        }}></div>: null}

                  <div className='rope-top'>2</div>
                  <div className='marker'>2</div>
                  <div className='marker'>2</div>
                </div>
                <div className='rope rope-size-5'>
                  {Object.keys(assets.board[3].players).map((color, idx) => (
                    assets.board[3].players[color] === 0 ? null : <div className='player-marker' style={{
                        backgroundColor: `${color}`,
                        bottom: `${((assets.board[3].players[color] - 1) * 53) - 5}px`,
                        right: `${-10 - (4 * idx)}px`
                      }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(3) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[3] - 1) * 53) - 5}px`,
                          right: `-7px`
                        }}></div>: null}
                  <div className='rope-top'>3</div>
                  <div className='marker'>3</div>
                  <div className='marker'>3</div>
                  <div className='marker'>3</div>
                  <div className='marker'>3</div>
                </div>
                <div className='rope rope-size-7'>
                  {Object.keys(assets.board[4].players).map((color, idx) => (
                      assets.board[4].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[4].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                    )}

                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(4) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[4] - 1) * 53) - 5}px`,
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
                  {Object.keys(assets.board[5].players).map((color, idx) => (
                      assets.board[5].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[5].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(5) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[5] - 1) * 53) - 5}px`,
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
                {Object.keys(assets.board[6].players).map((color, idx) => (
                      assets.board[6].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[6].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                  {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(6) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[6] - 1) * 53) - 5}px`,
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
                {Object.keys(assets.board[7].players).map((color, idx) => (
                    assets.board[7].players[color] === 0 ? null : <div className='player-marker' style={{
                        backgroundColor: `${color}`,
                        bottom: `${((assets.board[7].players[color] - 1) * 53) - 5}px`,
                        right: `${-10 - (4 * idx)}px`
                      }}></div>)
                  )}

                  {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(7) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[7] - 1) * 53) - 5}px`,
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
                  {Object.keys(assets.board[8].players).map((color, idx) => (
                      assets.board[8].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[8].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                  {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(8) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[8] - 1) * 53) - 5}px`,
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
                  {Object.keys(assets.board[9].players).map((color, idx) => (
                      assets.board[9].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[9].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}

                  
                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(9) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[9] - 1) * 53) - 5}px`,
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
                  {Object.keys(assets.board[10].players).map((color, idx) => (
                      assets.board[10].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[10].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(10) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[10] - 1) * 53) - 5}px`,
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
                  {Object.keys(assets.board[11].players).map((color, idx) => (
                      assets.board[11].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[11].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(11) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[11] - 1) * 53) - 5}px`,
                          right: `-14px`
                        }}></div>: null}
                  <div className='rope-top'>11</div>
                  <div className='marker'>11</div>
                  <div className='marker'>11</div>
                  <div className='marker'>11</div>
                  <div className='marker'>11</div>
                </div>
                <div className='rope rope-size-3'>
                  {Object.keys(assets.board[12].players).map((color, idx) => (
                      assets.board[12].players[color] === 0 ? null : <div className='player-marker' style={{
                          backgroundColor: `${color}`,
                          bottom: `${((assets.board[12].players[color] - 1) * 53) - 5}px`,
                          right: `${-10 - (4 * idx)}px`
                        }}></div>)
                  )}


                {assets.currentRun && Object.keys(assets.currentRun).map(val => parseInt(val)).includes(12) ? <div className='player-marker' style={{
                          backgroundColor: `black`,
                          bottom: `${((assets.currentRun[12] - 1) * 53) - 5}px`,
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
            <h2>Current Move: {gameState.name}</h2>
            {renderClimbPhaseButtons()}
            {renderRouteButtons()}
          </div>

          <div className='dont-stop-right-container'>
                <div className='scoreboard-container'>
                  <div>
                    <h1>Players</h1>
                    <div className='player-container'>
                      <div>
                        
                      </div>
                      <div className='player-scores'>
                        {assets.players.map((player, idx) => {
                          return <div key={idx} className='player-stats'>
                              <div>{player.score}</div>
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
              </div>                
          </div>
          {/* 
        <ul>
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