import { RECEIVE_USERS, RECEIVE_USER, RECEIVE_ALL_USERS } from '../actions/user_actions';
import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { RECEIVE_ROOM } from '../actions/room_actions';
import { room_users } from '../selectors/room_users';

const usersReducer = (state = {}, action) => {
    Object.freeze(state);
    const nextState = Object.assign({}, state)
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            nextState[action.currentUser._id] = action.currentUser
            return nextState;
        case RECEIVE_ALL_USERS:
            return action.users.reduce((obj, user) => (obj[user._id] = user, obj) ,{});
        case RECEIVE_USERS:
            action.users.forEach(user => nextState[user._id] = user)
            return nextState;
        case RECEIVE_USER:
            nextState[action.user._id] = action.user
            return nextState;
        case RECEIVE_ROOM:
            room_users(action.room).forEach(user => nextState[user._id] = user)
            return nextState;
        default:
            return state;
    };
};

export default usersReducer;