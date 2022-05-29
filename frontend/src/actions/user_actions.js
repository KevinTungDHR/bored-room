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

export const fetchUser = (userId) => dispatch => {
    return APIUtil.fetchUser(userId)
        .then(res => dispatch(receiveCurrentUser(res.data)),
        errors => dispatch(receiveErrors(errors.response.data)))
}

export const updateUser = user => dispatch => {
    return APIUtil.updateUser(user)
        .then(res => dispatch(receiveCurrentUser(res.data)),
        errors => dispatch(receiveErrors(errors.response.data)))
}