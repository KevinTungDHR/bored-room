import axios from 'axios';

export const updateUser = (user) => {
    debugger;
    return axios.patch('/api/users/profile-update', user)
}

