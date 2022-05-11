import { combineReducers } from 'redux';
import RoomErrorsReducer from './room_errors_reducer';
import SessionErrorsReducer from './session_errors_reducer';

export default combineReducers({
    session: SessionErrorsReducer,
    room: RoomErrorsReducer
});