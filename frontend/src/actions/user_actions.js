import * as APIUtil from '../util/user_api_util';
import { receiveErrors } from './session_actions';

export const UPDATE_USER = "UPDATE_USER";

const patchUser = (user) => {
    return {
        type: UPDATE_USER,
        user
    }
};

export const updateUser = user => dispatch => {
    return APIUtil.updateUser(user)
        .then(res => dispatch(patchUser(res)),
        errors => dispatch(receiveErrors(errors)))
}

