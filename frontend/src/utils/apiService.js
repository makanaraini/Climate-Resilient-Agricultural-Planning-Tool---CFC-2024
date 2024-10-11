import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API error:', error.response.data);
      alert('An error occurred: ' + error.response.data.message);
    } else {
      console.error('Network error:', error.message);
      alert('Network error: Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// Custom hook to fetch weather data
export const useWeatherData = () => {
  const { token } = useAuth(); // Correct usage of useAuth

  const fetchWeatherData = async () => {
    // Fetch weather data logic using the token...
    console.log("Fetching weather data with token:", token);
    // Example fetch request (replace with your actual API call)
    const response = await fetch('http://localhost:5000/api/weather-data', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data; // Return the fetched data
  };

  return { fetchWeatherData }; // Return the function to use it in components
};

// Custom hook to verify token validity
export const useVerifyToken = () => {
  const { token } = useAuth();

  const verifyToken = async () => {
    try {
      if (!token) {
        throw new Error('No token found');
      }
      const response = await api.post('/verify-token', { token });
      return response.data.isValid;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  return verifyToken;
};

// Custom hook for verifying token
export const useTokenVerification = () => {
  const { token } = useAuth(); // Correct usage of useAuth

  const verifyToken = () => {
    // Token verification logic...
    console.log("Verifying token:", token);
    // Add your verification logic here
  };

  return { verifyToken }; // Return the function to use it in components
};

export default api;