import { RECEIVE_ROOMS, RECEIVE_ROOM, RECEIVE_ROOM_ERRORS } from "../actions/room_actions";

const RoomErrorsReducer = (state = [], action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ROOM_ERRORS:
      return action.errors;
    case RECEIVE_ROOMS:
    case RECEIVE_ROOM:
      return [];
    default:
      return state;
  }
}

export default RoomErrorsReducer;