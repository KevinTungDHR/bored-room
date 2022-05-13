import axios from 'axios';

export const fetchAllRooms = () => {
  return axios.get('/api/rooms/')
}

export const createRoom = (name) => {
  return axios.post('/api/rooms/', { name })
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

export const deleteRoom = (roomCode) => {
  return axios.delete(`/api/rooms/${roomCode}`)
}