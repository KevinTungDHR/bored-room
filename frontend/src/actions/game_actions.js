import * as GameAPIUtil from '../util/game_util';

export const RECEIVE_GAME = "RECEIVE_GAME";
export const RECEIVE_GAME_ERRORS = 'RECEIVE_GAME_ERRORS';

const receiveGame = (game) => {
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

export const fetchGame = (gameId) => (dispatch) => {
  return GameAPIUtil.fetchGame(gameId)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}

export const createGame = (users) => (dispatch) => {
  return GameAPIUtil.createGame(users)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}

export const updateGame = (gameId, payload) => dispatch => {
  return GameAPIUtil.updateGame(gameId, payload)
    .then(res => dispatch(receiveGame(res.data)))
    .catch(errors => dispatch(receiveGameErrors(errors)))
}