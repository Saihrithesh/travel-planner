import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept response to globally catch token expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token if the API returns 401 Unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirecting might be handled in a component or router layer
    }
    return Promise.reject(error);
  }
);

export default api;
