import * as APIUtil from '../util/profile_api_util';
import { receiveErrors } from './session_actions';

export const UPDATE_USER = "UPDATE_USER";

const receiveUser = (user) => {
    debugger;
    return {
        type: UPDATE_USER,
        user
    }
};

export const updateUser = user => dispatch => {
    debugger;
    return APIUtil.updateUser(user)
        .then(res => dispatch(receiveUser(res)),
        errors => dispatch(receiveErrors(errors)))
}