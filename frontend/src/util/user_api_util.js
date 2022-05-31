import axios from 'axios';

export const updateUser = (user) => {
    return axios.patch('/api/users/profile', user)
}

export const fetchCurrentUser = () => {
    return axios.get('/api/users/profile')
}

export const fetchUser = (userId) => {
    return axios.get(`/api/users/profile/${userId}`)
}

export const fetchAllUsers = () => {
    return axios.get(`/api/users/`)
}

export const fetchFriends = (userId) => {
    return axios.get(`/api/friends/${userId}`)
}