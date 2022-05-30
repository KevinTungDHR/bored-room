import { RECEIVE_USERS, RECEIVE_USER } from '../actions/user_actions';
import { RECEIVE_CURRENT_USER } from '../actions/session_actions';

const usersReducer = (state = {}, action) => {
    Object.freeze(state);
    const nextState = Object.assign({}, state)
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            nextState[action.currentUser._id] = action.currentUser
            return nextState;
        case RECEIVE_USERS:
            return action.users.reduce((acc, curr) => ({ ...acc, [curr._id]: curr }));
        case RECEIVE_USER:
            nextState[action.user._id] = action.user
            return nextState;
        default:
            return state;
    };
};

export default usersReducer;