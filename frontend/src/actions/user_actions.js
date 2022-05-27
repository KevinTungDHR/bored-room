import { receiveErrors, receiveCurrentUser } from './session_actions';
import * as APIUtil from '../util/user_api_util';

export const UPDATE_AVATAR = 'UPDATE_AVATAR';
export const RECEIVE_USER = 'RECEIVE_USER';

const receiveUser = (user) => {
    return {
        type: RECEIVE_USER,
        user
    }
}

export const fetchUser = () => dispatch => {
    return APIUtil.fetchUser()
        .then(res => dispatch(receiveCurrentUser(res.data)),
        errors => dispatch(receiveErrors(errors)))
}

export const updateUser = user => dispatch => {
    return APIUtil.updateUser(user)
        .then(res => dispatch(receiveCurrentUser(res.data)),
        errors => dispatch(receiveErrors(errors)))
}

export const updateAvatar = avatar => dispatch => {
    return APIUtil.updateAvatar(avatar)
        .then(res => dispatch(receiveCurrentUser(res.data)),
        errors => dispatch(receiveErrors(errors)))
}

// export const fetchUser = user => dispatch => {
//     return APIUtil.
// }

// id: req.user.id,
//     handle: req.user.handle,
//         email: req.user.email,
//             avatar: req.user.avatar,
//                 eloRating: req.user.eloRating,
//                     bio: req.user.bio