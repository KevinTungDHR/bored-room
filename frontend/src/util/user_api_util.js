import axios from 'axios';

export const updateUser = (user) => {
    return axios.patch('/api/users/profile', user)
}

export const fetchUser = () => {
    return axios.get('/api/users/profile')
}

export const updateAvatar = (avatar) => {
    return axios.patch('/api/users/update-avatar', avatar)
}