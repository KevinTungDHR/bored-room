import { receiveErrors } from './session_actions';
import * as APIUtil from '../util/user_api_util';

export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_AVATAR = 'UPDATE_AVATAR';
export const FETCH_USER = 'FETCH_USER';

const patchUser = (user) => {
    debugger
    return {
        type: UPDATE_USER,
        user
    }
};

const receiveAvatar = (avatar) => {
    return {
        type: UPDATE_AVATAR,
        avatar
    }
}

export const updateUser = user => dispatch => {
    return APIUtil.updateUser(user)
        .then(res => dispatch(patchUser(res)),
        errors => dispatch(receiveErrors(errors)))
}

export const updateAvatar = avatar => dispatch => {
    return APIUtil.updateAvatar(avatar)
        .then(res => dispatch(receiveAvatar(res)),
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