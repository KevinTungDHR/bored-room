import axios from 'axios';


export const fetchGame = (code) => {
  return axios.get(`/api/games/${code}`)
}

export const createGame = (code, users) => {
  return axios.post('/api/games/create', { code, users })
}

export const createDemo = (code, users) => {
  return axios.post('/api/games/createDemo', { code, users })
}

export const updateGame = (code, payload) => {
  return axios.patch(`/api/games/${code}`, payload)
}
