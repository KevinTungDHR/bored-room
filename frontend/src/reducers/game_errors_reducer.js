import { 
  RECEIVE_GAME, 
  RECEIVE_GAME_ERRORS 
} from "../actions/game_actions";

const gameErrorsReducer = (state = [], action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_GAME_ERRORS:
      return action.errors;
    case RECEIVE_GAME:
      return [];
    default:
      return state;
  }
}

export default gameErrorsReducer;