import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server Error:', error.response.data);
      // You can dispatch a notification here if you want to show errors globally
      // For example: showNotification('An error occurred', 'error');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      // showNotification('Network error. Please check your connection.', 'error');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      // showNotification('An unexpected error occurred', 'error');
    }
    return Promise.reject(error);
  }
);

export default axios;
