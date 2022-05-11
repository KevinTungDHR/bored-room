import { combineReducers } from 'redux';
import roomReducer from './room_reducer';
import usersReducer from './users_reducer';

const entitiesReducer = combineReducers({
    rooms: roomReducer,
    users: usersReducer
});

export default entitiesReducer;