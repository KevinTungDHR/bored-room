import * as GameAPIUtil from '../util/game_util';

export const RECEIVE_GAME = "RECEIVE_GAME";
export const RECEIVE_GAME_ERRORS = 'RECEIVE_GAME_ERRORS';

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
  return GameAPIUtil.fetchGame(roomCode)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}

export const createGame = (code, users) => (dispatch) => {
  return GameAPIUtil.createGame(code, users)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}

export const updateGame = (roomCode, payload) => dispatch => {
  return GameAPIUtil.updateGame(roomCode, payload)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}