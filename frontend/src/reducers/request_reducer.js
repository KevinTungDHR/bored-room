import { FINISH_REQUEST, START_REQUEST } from "../actions/request_actions";

const initialState = {
  friendsLoaded: false
}
const requestReducer = (state = initialState, action) => {
  Object.freeze(state);
  const nextState = Object.assign({}, state)
  switch(action.type){
    case START_REQUEST:
      nextState[action.request] = false;
      return nextState;
    case FINISH_REQUEST:
      nextState[action.request] = true;
      return nextState;
    default:
      return state;
  }
}

export default requestReducer;