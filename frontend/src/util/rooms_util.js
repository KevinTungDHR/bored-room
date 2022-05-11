import axios from 'axios';


export const fetchAllRooms = () => {
  return axios.post('/api/rooms/')
}

export const createRoom = (roomName) => {
  return axios.post('/api/rooms/', roomName)
}

export const fetchRoom = (roomCode) => {
  return axios.post(`/api/rooms/${roomCode}`)
}

export const joinRoom = (roomCode) => {
  return axios.post(`/api/rooms/${roomCode}/join`)
}

export const leaveRoom = (roomCode) => {
  return axios.post(`/api/rooms/${roomCode}/leave`)
}

