import { combineReducers } from 'redux';
import gameErrorsReducer from './game_errors_reducer';
import RoomErrorsReducer from './room_errors_reducer';
import SessionErrorsReducer from './session_errors_reducer';

export default combineReducers({
    session: SessionErrorsReducer,
    room: RoomErrorsReducer,
    game: gameErrorsReducer
});