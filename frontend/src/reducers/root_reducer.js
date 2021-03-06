import { combineReducers } from 'redux';
import errors from './errors_reducer';
import session from './session_api_reducer';
import ui from './ui_reducer';
import entities from './entities_reducer';
import games from './game_reducer';

const RootReducer = combineReducers({
    entities,
    session,
    errors,
    ui,
    games
});

export default RootReducer;