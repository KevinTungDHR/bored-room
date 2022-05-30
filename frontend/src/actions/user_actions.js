import { receiveErrors, receiveCurrentUser } from './session_actions';
import * as APIUtil from '../util/user_api_util';

export const UPDATE_AVATAR = 'UPDATE_AVATAR';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';

const receiveUser = (user) => {
    return {
        type: RECEIVE_USER,
        user
    }
}

const receiveUsers = (users) => {
    return {
        type: RECEIVE_USERS,
        users
    }
}


export const fetchAllUsers = () => dispatch => {
    return APIUtil.fetchAllUsers()
    .then(res => dispatch(receiveUsers(res.data)),
    errors => dispatch(receiveErrors(errors.response.data)))
}

export const fetchUser = (userId) => dispatch => {
    return APIUtil.fetchUser(userId)
    .then(res => dispatch(receiveUser(res.data)),
    errors => dispatch(receiveErrors(errors.response.data)))
}

export const fetchCurrentUser = () => dispatch => {
    return APIUtil.fetchCurrentUser()
        .then(res => dispatch(receiveCurrentUser(res.data)),
        errors => dispatch(receiveErrors(errors.response.data)))
}

export const updateUser = user => dispatch => {
    return APIUtil.updateUser(user)
        .then(res => dispatch(receiveCurrentUser(res.data)),
        errors => dispatch(receiveErrors(errors.response.data)))
}