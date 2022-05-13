import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, receiveGame } from '../../actions/game_actions';
import { updateGame } from '../../util/game_util';
import { Card } from './card';
import GridRow from './grid_row';
import CardSelection from './card_selection';
import bull_brown from '../../assets/images/bull_brown.png';
import bull_purp from '../../assets/images/bull_purp.png';
import bull_logo from '../../assets/images/bull_logo.png';
import {AiFillStar} from 'react-icons/ai';

const GameComponent = ({ roomCode, socket }) => {
  const [chosenCard, setChosenCard] = useState();
  const [chosenRow, setChosenRow] = useState();
  const [isAnimating, setIsAnimating] = useState(false);
  const [stateQueue, setStateQueue] = useState([]);
  const { gameState, assets } = useSelector(state => state.game);
  const sessionId = useSelector(state => state.session.user.id);
  const player = useSelector(state => state.game?.assets?.players?.filter(p => p._id === sessionId)[0])
  const users = useSelector(state => state.entities.rooms[roomCode].seatedUsers?.map(user => user.handle))
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

  useEffect(() => {
    if(!isAnimating && stateQueue.length > 0){
      let nextUpdate = stateQueue[0];
      setStateQueue(oldState => oldState.slice(1));
      dispatch(receiveGame(nextUpdate))
    }
  }, [isAnimating])

  const handleUpdate = (e) => {
    e.preventDefault();
    const payload = {
      action: gameState.actions[0],
      card: chosenCard,
      row: chosenRow
    };
    updateGame(roomCode, payload)
      .then(data => console.log(data))
      .catch(err => console.error(err))
  };

    if (gameState) {
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
                      <div onClick={() => setChosenCard(c)}> 
                        <Card card={c} type={{value: 'hand'}} key={idx}/>
                      </div>)
                    })}
                  </div>
                </div>
                <div className='grid-selected-container'>
                  <div className='grid-container'>
                    <div className='game-grid'>
                      {assets.rows.map((row, idx) => <GridRow idx={idx} setChosenRow={setChosenRow} row={row} key={idx} />)}
                    </div>
                    <div></div>
                  </div>

                  {/* insert player selections */}
                  <div className='selected-cards-wrapper'>
                    {<CardSelection cards={assets.playedCards} users={users} setIsAnimating={setIsAnimating} />}
                  </div>
                </div>

              </div>

              <div className='scoreboard-container'>
                <div>
                  <h1>Players</h1>
                  <div className='player-container'>
                      {users.map((player) => {
                        return (
                          <div>
                            {player}
                          </div>
                        )
                      })}

                      {assets.players.map((player) => {
                        return <div className='player-stats'>
                            {player.score}
                            <AiFillStar className="ai-star-icon" />
                          </div>
                      })}
                  </div>
                </div>
              </div>

              <ul>
                
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
              <button onClick={handleUpdate}>Update Game</button>

            </div>
          </div>
        </div>
    )
  }
}

export default GameComponent;

{/* <h2>Game State</h2>
  <div>Chosen Card: {chosenCard?.value}</div>
  <div>Chosen Row: {chosenRow}</div>
  <div>Your points: {player?.score}</div> */}