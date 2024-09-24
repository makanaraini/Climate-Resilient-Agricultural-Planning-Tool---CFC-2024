import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Planning from './pages/Planning';
import Dashboard from './pages/Dashboard';
import SoilAnalysis from './pages/SoilAnalysis';
import MarketTrends from './components/MarketTrends'; // Ensure this path is correct
import DataInputForm from './components/DataInputForm'; // Ensure this path is correct
import './App.css'; // Import the CSS file
import CropRecommendationsProvider from './contexts/CropRecommendationsContext';
import { fetchWeatherData } from './utils/supabaseService';
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary

const theme = createTheme();

function App() {
  useEffect(() => {
    const getData = async () => {
      const data = await fetchWeatherData();
      console.log(data); // Check if data is fetched correctly
    };
    getData();
  }, []);

  return (
    <ErrorBoundary> {/* Wrap your application in ErrorBoundary */}
      <CropRecommendationsProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AuthProvider>
              <div className="app-container">
                <div className="sidebar">
                  <Navbar />
                </div>
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
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
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </CropRecommendationsProvider>
    </ErrorBoundary>
  );
}

export default App;
