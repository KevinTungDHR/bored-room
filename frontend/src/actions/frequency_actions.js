import * as FrequencyAPIUtil from '../util/frequency_util';
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
  return FrequencyAPIUtil.fetchGame(roomCode)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}

export const createGame = (code, users) => (dispatch) => {
  return FrequencyAPIUtil.createGame(code, users)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}

export const updateGame = (roomCode, payload) => dispatch => {
  return FrequencyAPIUtil.updateGame(roomCode, payload)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}