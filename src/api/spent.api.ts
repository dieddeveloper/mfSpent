
import axios from 'axios';

const spentApi = axios.create({
  baseURL: 'http://localhost:3000/api',
});

spentApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
});


export  { spentApi };