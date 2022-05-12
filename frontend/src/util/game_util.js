import axios from 'axios';


export const fetchGame = (gameId) => {
  return axios.get(`/api/games/${gameId}`)
}

export const createGame = (users) => {
  return axios.post('/api/games/create', { users })
}

export const updateGame = (gameId, payload) => {
  return axios.patch(`/api/games/${gameId}`, payload)
}