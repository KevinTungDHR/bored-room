import axios from 'axios';

export const fetchGame = (code) => {
  return axios.get(`/api/frequency/${code}`)
}

export const createGame = (code, teams) => {
  return axios.post('/api/frequency/create', { code, teams })
}

export const createDemo = (code, teams) => {
  return axios.post('/api/frequency/createDemo', { code, teams })
}

export const updateGame = (code, payload) => {
  return axios.patch(`/api/frequency/${code}`, payload)
}
