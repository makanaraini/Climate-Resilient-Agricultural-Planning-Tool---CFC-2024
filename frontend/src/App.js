import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';  // Make sure this is the correct path
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Planning from './pages/Planning';
import Dashboard from './pages/Dashboard';
import SoilAnalysis from './pages/SoilAnalysis';
import MarketTrends from './components/MarketTrends';
import DataInputForm from './components/DataInputForm';
import './App.css';
import CropRecommendationsProvider from './contexts/CropRecommendationsContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useWeatherData } from './utils/apiService';
import axios from 'axios';

const theme = createTheme();

// Configure axios defaults for CORS
axios.defaults.withCredentials = true;

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { token, user } = useAuth();  // Now it's properly within AuthProvider
  const { data: weatherData, error: weatherError } = useWeatherData();

  useEffect(() => {
    // Set up axios interceptor to add JWT token to all requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Log weather data or error
    if (weatherData) {
      console.log(weatherData);
    }
    if (weatherError) {
      console.error('Error fetching weather data:', weatherError);
    }

    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token, weatherData, weatherError]);

  return (
    <ErrorBoundary>
      <CropRecommendationsProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div className="app-container">
              <div className="sidebar">
                <Navbar />
              </div>
              <div className="main-content">
                <Routes>
                  <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                  <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
                  <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />
                  <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                  <Route path="/planning" element={<PrivateRoute><Planning /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/soil-analysis" element={<PrivateRoute><SoilAnalysis /></PrivateRoute>} />
                  <Route path="/market-trends" element={<PrivateRoute><MarketTrends /></PrivateRoute>} />
                  <Route path="/data-input" element={<PrivateRoute><DataInputForm /></PrivateRoute>} />
                </Routes>
              </div>
            </div>
          </Router>
        </ThemeProvider>
      </CropRecommendationsProvider>
    </ErrorBoundary>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
