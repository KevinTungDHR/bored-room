import axios from 'axios';

export const addFriend = (userId) => {
  return axios.post(`/api/friends/request/${userId}`)
}

export const cancelRequest = (userId) => {
  return axios.delete(`/api/friends/request/${userId}`)
}

export const acceptRequest = (userId) => {
  return axios.post(`/api/friends/accept/${userId}`)
}

export const rejectRequest = (userId) => {
  return axios.post(`/api/friends/reject/${userId}`)
}

export const unblockUser = (userId) => {
  return axios.delete(`/api/friends/reject/${userId}`)
}

export const removeFriend = (userId) => {
  return axios.delete(`/api/friends/${userId}`)
}