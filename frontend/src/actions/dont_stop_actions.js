import * as DontStopAPIUtil from '../util/dont_stop_util';
import { RECEIVE_GAME, RECEIVE_GAME_ERRORS } from './game_actions'

export const receiveGame = (game) => {
  return {
    type: RECEIVE_GAME,
    game
  }
}

const receiveGameErrors = (errors) => {
  return {
    type: RECEIVE_GAME_ERRORS,
    errors
  }
}

export const fetchGame = (roomCode) => (dispatch) => {
  return DontStopAPIUtil.fetchGame(roomCode)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors.response.data)))
}

export const createGame = (code, users) => (dispatch) => {
  return DontStopAPIUtil.createGame(code, users)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors.response.data)))
}

export const updateGame = (roomCode, payload) => dispatch => {
  return DontStopAPIUtil.updateGame(roomCode, payload)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors.response.data)))
}