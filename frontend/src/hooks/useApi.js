import { useAuth } from '../contexts/AuthContext.js';
import axios from 'axios';

export const useApi = () => {
  const { token } = useAuth();
  
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        logout();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return api;
};
