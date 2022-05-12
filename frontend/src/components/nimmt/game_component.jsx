import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, receiveGame } from '../../actions/game_actions';
import { updateGame } from '../../util/game_util';
import { Card } from './card';
import { GridRow } from './grid_row';
import bull_brown from '../../assets/images/bull_brown.png';
import bull_purp from '../../assets/images/bull_purp.png';
import bull_logo from '../../assets/images/bull_logo.png';

const GameComponent = ({ roomCode, socket }) => {
  const [chosenCard, setChosenCard] = useState();
  const [chosenRow, setChosenRow] = useState();
  const { gameState, assets } = useSelector(state => state.game);
  const sessionId = useSelector(state => state.session.user.id);
  const player = useSelector(state => state.game?.assets?.players?.filter(p => p._id === sessionId)[0])
  const dispatch = useDispatch();

  // const bullBrown = <img src={bull_brown} height="70px" width="70px" />
  // const bullPurp = <img className="small-bull" src={bull_purp} height="16px" width="16px" />
  const bullLogo = <img className="bull-logo" src={bull_logo} height="700px" width="700px" />

  useEffect(() => {
    dispatch(fetchGame(roomCode));
    socket.on('game_updated', (game) => dispatch(receiveGame(game)));

  },[]);

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
        <div>
          <div>
            <h1 className='game-state-description'>{gameState.description}</h1>
          </div>
          <div className='board-background'>
            
            <div className='hand-container'>
              {bullLogo}
              <div className="card-container">
                {player?.hand.map(c => {
                  return <Card clicked={setChosenCard} card={c} />;
                })}
              </div>
            </div>
            <div className='grid-container'>
              <div className='game-grid'>
                {Array.from(Array(24).keys()).map((square) => 
                  <div className='blank-square'></div> 
                )}
              </div>
              <div></div>
            </div>

            <ul>
              <li onClick={() => setChosenRow(0)}>row 0: {assets.rows[0].map(card => card.value).join(", ")}</li>
              <li onClick={() => setChosenRow(1)}>row 1: {assets.rows[1].map(card => card.value).join(", ")}</li>
              <li onClick={() => setChosenRow(2)}>row 2: {assets.rows[2].map(card => card.value).join(", ")}</li>
              <li onClick={() => setChosenRow(3)}>row 3: {assets.rows[3].map(card => card.value).join(", ")}</li>
            </ul>
            <ul>
              <li>name: {gameState.name}</li>
              <li>score: {player?.score}</li>
              <li>possible_actions: {gameState.possibleActions}</li>
              <li>actions: {gameState.actions}</li>
              <li>type: {gameState.type}</li>
              <li>transitions: {Object.keys(gameState.transitions).map(t => <div>{t}</div>)} </li>
            </ul> 
            <button onClick={handleUpdate}>Update Game</button>
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
