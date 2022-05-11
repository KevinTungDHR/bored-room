import { UPDATE_AVATAR, UPDATE_USER } from '../actions/user_actions';

export default function (state = initialState, action) {
    Object.freeze(state);
    switch (action.type) {
        case UPDATE_AVATAR:
            return Object.assign({}, state, {[state.session.user.avatar]: action.avatar} )
        default:
            return state;
    }
}