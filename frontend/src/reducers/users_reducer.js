import { RECEIVE_USER, UPDATE_AVATAR, UPDATE_USER } from '../actions/user_actions';

const usersReducer = (state = {}, action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_USER:
            return {[action.user.data.id]: action.user.data};
        case UPDATE_AVATAR:
            return Object.assign({}, state, {[state.session.user.avatar]: action.avatar});
        case UPDATE_USER:
            let newState = Object.assign({}, state);
            return newState;
        default:
            return state;
    };
};

export default usersReducer;