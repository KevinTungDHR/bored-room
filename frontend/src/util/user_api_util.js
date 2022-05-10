import axios from 'axios';

export const updateUser = (user) => {
    return axios.patch('/api/users/update-profile', user)
}

export const fetchUser = (userId) => {
    return axios.get('/api/users/profile')
}

