import * as FriendshipAPIUtil from '../util/friendships_util';
import { receiveCurrentUser, receiveErrors } from './session_actions';

export const addFriend = (userId) => dispatch => {
  return FriendshipAPIUtil.addFriend(userId)
    .then(res => dispatch(receiveCurrentUser(res.data)))
    .catch(errors => dispatch(receiveErrors(errors.response.data)));
}

export const cancelRequest = (userId) => dispatch => {
  return FriendshipAPIUtil.cancelRequest(userId)
    .then(res => dispatch(receiveCurrentUser(res.data)))
    .catch(errors => dispatch(receiveErrors(errors.response.data)));
}

export const acceptRequest = (userId) => dispatch => {
  return FriendshipAPIUtil.acceptRequest(userId)
    .then(res => dispatch(receiveCurrentUser(res.data)))
    .catch(errors => dispatch(receiveErrors(errors.response.data)));
}

export const rejectRequest = (userId) => dispatch => {
  return FriendshipAPIUtil.rejectRequest(userId)
    .then(res => dispatch(receiveCurrentUser(res.data)))
    .catch(errors => dispatch(receiveErrors(errors.response.data)));
}
export const unblockUser = (userId) => dispatch => {
  return FriendshipAPIUtil.unblockUser(userId)
    .then(res => dispatch(receiveCurrentUser(res.data)))
    .catch(errors => dispatch(receiveErrors(errors.response.data)));
}

export const removeFriend = (userId) => dispatch => {
  return FriendshipAPIUtil.removeFriend(userId)
    .then(res => dispatch(receiveCurrentUser(res.data)))
    .catch(errors => dispatch(receiveErrors(errors.response.data)));
}