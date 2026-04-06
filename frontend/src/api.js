import axios from 'axios';

/**
 * 🚀 API CONFIGURATION
 * This file sets up how our frontend talks to our backend server.
 */

// 1. Determine the backend URL (local or production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// 2. Create an "axios instance" which is like a pre-configured messenger
const api = axios.create({
  baseURL: API_URL,
});

/**
 * 🛡️ REQUEST INTERCEPTOR
 * Before every single request we send to the backend, this code runs automatically.
 * We use it to attach our "Security Token" (JWT) if the user is logged in.
 */
api.interceptors.request.use(
  (config) => {
    // Look for the 'token' we saved in the browser's storage
    const token = localStorage.getItem('token');
    
    // If we have a token, add it to the "Authorization" header
    // This is like showing our ID card to the backend server
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // If something goes wrong before the request is even sent
    return Promise.reject(error);
  }
);

/**
 * 🚥 RESPONSE INTERCEPTOR
 * Every time the backend sends a response back to us, this code runs first.
 * It's great for handling errors like "Expired Session" in one single place.
 */
api.interceptors.response.use(
  (response) => response, // If the response is good, just pass it along
  (error) => {
    // If the backend says "401 Unauthorized" (meaning the token is old or wrong)
    if (error.response?.status === 401) {
      // Clear the local storage so the user has to log in again
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Note: A real app might redirect the user to the login page here
    }
    // Pass the error along to the component that made the request
    return Promise.reject(error);
  }
);

export default api;

