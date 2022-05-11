import { combineReducers } from 'redux';
import errors from './errors_reducer';
import session from './session_api_reducer';
import ui from './ui_reducer';

const RootReducer = combineReducers({
    session,
    errors,
    ui
});

export default RootReducer;