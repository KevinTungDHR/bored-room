import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, receiveGame } from '../../actions/game_actions';
import { updateGame } from '../../util/game_util';
import { Card } from './card';
import CardSelection from './card_selection';
import bull_logo from '../../assets/images/bull_logo.png';
import {AiFillStar} from 'react-icons/ai';
import { openModal } from '../../actions/modal_actions';
import GameEnd from './game_end';
import { motion } from 'framer-motion';

const GameComponent = ({ roomCode, socket }) => {
  const [chosenCard, setChosenCard] = useState();
  const [chosenRow, setChosenRow] = useState();
  const [isAnimating, setIsAnimating] = useState(false);
  const [stateQueue, setStateQueue] = useState([]);
  const gameState = useSelector(state => state.games[roomCode]?.gameState);
  const assets = useSelector(state => state.games[roomCode]?.assets);
  const sessionId = useSelector(state => state.session.user.id);
  const player = useSelector(state => state.games[roomCode]?.assets?.players?.filter(p => p._id === sessionId)[0])
  const allPlayers = useSelector(state => state.games[roomCode]?.assets?.players)
  const usersHandles = useSelector(state => state.entities.rooms[roomCode].seatedUsers?.map(user => user.handle))
  const allUsers = useSelector(state => state.entities.rooms[roomCode].seatedUsers);
  const dispatch = useDispatch();
  const bullLogo = <img className="bull-logo" src={bull_logo} height="700px" width="700px" />

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

  const setChoiceAndUpdate = (c, e) => {
    const chosenEles = document.getElementsByClassName('card chosen').length;
    if (gameState.possibleActions[0] === 'playCard' && chosenEles === 0) {
      if (e.target.className !== 'card') {
        e.target.parentElement.className += " chosen";
        setChosenCard(c);
      } else {
        e.target.className += ' chosen';
        setChosenCard(c);
      }
    }
  }

  const setRowAndUpdate = (idx) => {
    if (chosenRow === idx) {
      handleUpdate()
    } else {
      setChosenRow(idx);
    }
  }

  const firstUpdate = useRef(true)
  const firstUpdateRow = useRef(true)

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    const card = document.getElementsByClassName('chosen')[0];
    card.classList.remove('chosen');
    handleUpdate();
  }, [chosenCard])

  useEffect(() => {
    if (firstUpdateRow.current) {
      firstUpdateRow.current = false
      return
    }
    
    handleUpdate();

  }, [chosenRow])


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
      card: chosenCard,
      row: chosenRow
    };
    updateGame(roomCode, payload)
      .then(data => console.log(data))
      .catch(err => console.error(err))
  };

    if (gameState && assets) {
      return (
        <div className='game-flex-container'>
          <div>
            <h1 className='game-state-description'>{gameState.description + '...'}</h1>
          </div>

          <div className='game-background'>
            <div className='game-container'>

              <div className='board-container'>
                <div className='hand-container'>
                  
                  {bullLogo}
                  <div className="card-container">
                    {player?.hand.map((c, idx) => {
                      return (
                      <div className='card-overlay' onClick={(e) => setChoiceAndUpdate(c, e)} >
                        <Card card={c} type={{value: 'hand'}} key={idx} />
                      </div>)
                    })}
                  </div>
                </div>
                <div className='grid-selected-container'>
                  <div className='grid-container'>
                    <div className='game-grid'>
                      {assets.rows.map((row, idx) => {
                        return (
                          <div onClick={() => setRowAndUpdate(idx)} className='row-container'>
                            {[0, 1, 2, 3, 4, 5].map((i) => {
                              return <Card card={row[i]} type={{ value: 'row' }} index={i} key={i} />
                            })}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div></div>
                  </div>

                  {/* insert player selections */}
                  <div className='selected-cards-wrapper'>
                    {<CardSelection cards={assets.playedCards} allUsers={usersHandles} setIsAnimating={setIsAnimating} />}
                  </div>
                </div>

              </div>

              <div className='scoreboard-container'>
                <div>
                  <h1>Players</h1>
                  <div className='player-container'>
                    <div className='player-handles'>
                      {usersHandles.map((player) => {
                        return (
                          <div>
                            {player}
                          </div>
                        )
                      })}
                    </div>
                    <div className='player-scores'>
                      {assets.players.map((player) => {
                        return <div className='player-stats'>
                            <div>{player.score}</div>
                            <AiFillStar className="ai-star-icon" />
                          </div>
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <ul className='helper-detail'>
                
                <li>possible_actions: {gameState.possibleActions}</li>
                <li>description: {gameState.description}</li>
                <li>name: {gameState.name}</li>
                <li>actions: {gameState.actions}</li>
                <li>type: {gameState.type}</li>
                <li>transitions: {Object.keys(gameState.transitions).map(t => <div>{t}</div>)} </li>
                <li>Chosen Card: {chosenCard?.value}</li>
                <li>Chosen Row: {chosenRow}</li>
                <li>Your points: {player?.score}</li>
              </ul> 
              
                {gameState.actions[0] === 'gameEnd' && 
                  <motion.div 
                    className='end-game-backdrop'
                    animate={{ scale: [0, 1] }}
                    transition={{ duration: 0.5 }}>
                    <GameEnd allUsers={allUsers} allPlayers={allPlayers} />
                  </motion.div>
                }

            </div>
          </div>
        </div>
    )
  }
}

export default GameComponent;