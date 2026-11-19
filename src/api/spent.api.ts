
import axios from 'axios';

const spentApi = axios.create({
  baseURL: 'https://localhost:7129/',
});

spentApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
});


export  { spentApi };