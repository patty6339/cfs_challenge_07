// client/src/services/auth.service.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const authService = {
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  signin: async (credentials) => {
    const response = await api.post('/api/auth/signin', credentials);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};