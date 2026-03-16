import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
    baseURL: API_BASE_URL + '/api',
});

apiClient.interceptors.request.use((config) => {
    const stored = localStorage.getItem('sf_session');
    const token = stored ? JSON.parse(stored).access_token : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
