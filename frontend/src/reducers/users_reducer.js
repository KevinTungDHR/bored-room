import { RECEIVE_USER, UPDATE_AVATAR, UPDATE_USER } from '../actions/user_actions';

const usersReducer = (state = {}, action) => {
    Object.freeze(state);
    const nextState = Object.assign({}, state)
    switch (action.type) {
        case RECEIVE_USER:
            nextState[action.user.data.id] = action.user.data
            return nextState;
        case UPDATE_AVATAR:
            return Object.assign({}, state, {[state.session.user.avatar]: action.avatar});
        case UPDATE_USER:
            debugger
            nextState[action.user.data._id] = action.user.data
            return nextState;
        default:
            return state;
    };
};

export default usersReducer;