import { 
  RECEIVE_GAME, 
} from "../actions/game_actions";

const initialState = {
  assets: null,
  gameState: null
}

const gameReducer = (state = initialState, action) => {
  Object.freeze(state)
  switch(action.type){
    case RECEIVE_GAME:
      return action.game;      
    default:
      return state;
  }
}

export default gameReducer