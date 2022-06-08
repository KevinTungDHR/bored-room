import axios from 'axios';

export const fetchGame = (code) => {
  return axios.get(`/api/dontstop/${code}`)
}

export const createGame = (code, users) => {
  return axios.post('/api/dontstop/create', { code, users })
}

export const createDemo = (code, users) => {
  return axios.post('/api/dontstop/createDemo', { code, users })
}

export const updateGame = (code, payload) => {
  return axios.patch(`/api/dontstop/${code}`, payload)
}