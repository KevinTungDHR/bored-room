import { 
  RECEIVE_ROOMS, 
  RECEIVE_ROOM 
} from "../actions/room_actions";

const roomReducer = (state = {}, action) => {
  Object.freeze(state);
  const nextState = Object.assign({}, state)
  switch(action.type){
    case RECEIVE_ROOMS:
      return action.rooms;
    case RECEIVE_ROOM:
      nextState[action.room._id] = action.room;
      return nextState;
    default:
      return state;
  }
}

export default roomReducer;