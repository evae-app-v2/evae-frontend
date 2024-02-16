import axios from 'axios'

//const accessToken=localStorage.getItem('token');
const accessToken=localStorage.getItem('token');
axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
export const api = axios.create({
    baseURL: 'http://localhost:8085/',
});

export const headerAPI = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
}