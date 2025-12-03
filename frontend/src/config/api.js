import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8090',
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('thater_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
