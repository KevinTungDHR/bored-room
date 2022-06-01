import {
  RECEIVE_GAME,
} from "../actions/game_actions";

import { 
  REMOVE_ROOM
} from "../actions/room_actions";


const gameReducer = (state = {}, action) => {
  Object.freeze(state)
  const nextState = Object.assign({}, state);
  switch(action.type){
    case RECEIVE_GAME:
      nextState[action.game.assets.code] = action.game;
      return nextState;
    case REMOVE_ROOM:
      delete nextState[action.roomCode]
      return nextState;
    default:
      return state;
  }
}

export default gameReducer