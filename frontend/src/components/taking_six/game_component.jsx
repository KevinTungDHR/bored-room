import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, receiveGame } from '../../actions/game_actions';
import { updateGame } from '../../util/game_util';
import { Card } from './card';
import CardSelection from './card_selection';
import bull_logo from '../../assets/images/bull_logo.png';
import { AiFillStar } from 'react-icons/ai';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import GameEnd from './game_end';
import { motion } from 'framer-motion';

const GameComponent = ({ roomCode, socket }) => {
  const [chosenCard, setChosenCard] = useState();
  const [chosenRow, setChosenRow] = useState();
  const [isAnimating, setIsAnimating] = useState(false);
  const [stateQueue, setStateQueue] = useState([]);
  const [timers, setTimers] = useState([]);
  const timerRef = useRef(timers);
  const gameState = useSelector(state => state.games[roomCode]?.gameState);
  const assets = useSelector(state => state.games[roomCode]?.assets);
  const sessionId = useSelector(state => state.session.user.id);
  const player = useSelector(state => state.games[roomCode]?.assets?.players?.filter(p => p._id === sessionId)[0])
  const allPlayers = useSelector(state => state.games[roomCode]?.assets?.players)
  // const userHandles = useSelector(state => state.entities.rooms[roomCode].seatedUsers?.map(user => user.handle))
  const allUsers = useSelector(state => state.entities.rooms[roomCode].seatedUsers);
  const dispatch = useDispatch();
  const bullLogo = <img className="bull-logo" src={bull_logo} height="700px" width="700px" />
  
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
    if(!isAnimating && stateQueue.length > 0){
      let nextUpdate = stateQueue[0];
      if(nextUpdate.gameState.type === 'automated') {
        setIsAnimating(true)
        setStateQueue(oldState => oldState.slice(1));
        dispatch(receiveGame(nextUpdate))

        const timer = setTimeout(() => {
          setIsAnimating(false)
          setTimers(oldState => oldState.slice(1));
        }, 1000);

        setTimers(oldState => [...oldState, timer]);
        // Need to clearTimeout but it's being called on every rerender
      } else {
        setStateQueue(oldState => oldState.slice(1));
        dispatch(receiveGame(nextUpdate))
      }
    } 
  }, [stateQueue, isAnimating])

  const setChoiceAndUpdate = (c, e) => {
    const chosenEles = document.getElementsByClassName('card chosen').length;
    if (gameState.actions[0] === 'playCard' && chosenEles === 0) {
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
    if (gameState.actions[0] === 'playCard') return;
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
    if (card) {
      card.classList.remove('chosen');
    }

    handleUpdate();
  }, [chosenCard])

  useEffect(() => {
    if (firstUpdateRow.current) {
      firstUpdateRow.current = false
      return
    }
    
    handleUpdate();
  }, [chosenRow])

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
                          <div onClick={() => setRowAndUpdate(idx)} className={gameState.actions[0] === 'playCard' ? 'row-container-disabled' : 'row-container'} >
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
                    {<CardSelection cards={assets.playedCards} setIsAnimating={setIsAnimating} />}
                  </div>
                </div>

              </div>

              <div className='right-container'>
                <div className='scoreboard-container'>
                  <div>
                    <h1>Players</h1>
                    <div className='player-container'>
                      <div>
                        {allUsers.map((user) => {
                          let playedCard;
                          {allPlayers.forEach((player) => {
                              if (player._id === user._id) {
                                playedCard = player.chosenCard.value !== -1;
                              }
                          })}
                          return (
                            <div className='player-handles'>
                              {playedCard ? <AiOutlineCheckCircle className='chosen-indicator' /> : <span></span> }
                              {user.handle}
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

                <div className='taking-six-instructions'>
                  <div>
                    <h1>Taking Six Rules:</h1>
                    <span><h2>Setup:</h2> Every player starts with 66 points and a hand of 10 cards, ranging from 1 to 104. There are four rows starting with a single card in each row. Each row can take up to 5 cards.</span>
                    <span><h2>Objective:</h2> Have the most points remaining at the end of the game.</span>
                  </div>
                  <div>
                    <ol>
                      <h2>Game Play:</h2>
                      <li type="1">Each turn players simultaneously choose a card. Each card, in ascending order, is then placed in one of the four rows.</li>
                      <li type="1">The card added to a row must be higher than the last card in that row.</li>
                      <li type="1">The card added must always be added to a row with the smallest possible difference between the last card and the current one. For example, if the rows are: 10, 12, 15, 30, then the card numbered 16 must go in the third row after 15.</li>
                      <li type="1">The player who places the sixth card in a row takes all five cards and their card becomes the first card in the row</li>
                      <li type="1">The player who takes a row loses points based off the number of bull symbols on each card</li>
                      <li type="1">If a player plays a card that is so low that it cannot be placed in a row, that player must take all cards in a row of their choice.</li>
                    </ol>
                    <span><h2>Game End:</h2> A game ends when players have played all ten cards from their hand AND a player has reached 0 or fewer points.</span>
                  </div>
                  
                </div>
              </div>
{/* 
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
              </ul>  */}
              
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