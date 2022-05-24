import axios from 'axios';

export const fetchAllRooms = () => {
  return axios.get('/api/rooms/')
}

export const createRoom = (name, game) => {
  return axios.post('/api/rooms/', { name, game })
}

export const fetchRoom = (roomCode) => {
  return axios.get(`/api/rooms/${roomCode}`)
}

export const joinRoom = (roomCode) => {
  return axios.patch(`/api/rooms/${roomCode}/join`)
}

export const leaveRoom = (roomCode) => {
  return axios.patch(`/api/rooms/${roomCode}/leave`)
}

export const joinTeam = (roomCode, team) => {
  return axios.patch(`/api/rooms/${roomCode}/joinTeam`, team)
}

export const leaveTeam = (roomCode, team) => {
  return axios.patch(`/api/rooms/${roomCode}/leaveTeam`, team)
}

export const deleteRoom = (roomCode) => {
  return axios.delete(`/api/rooms/${roomCode}`)
}