import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles.js';
import CssBaseline from '@mui/material/CssBaseline.js';
import { AuthProvider } from './contexts/AuthContext.js';
import PrivateRoute from './components/PrivateRoute.js';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Profile from './pages/Profile.js';
import Reports from './pages/Reports.js';
import Planning from './pages/Planning.js';
import Dashboard from './pages/Dashboard.js';
import SoilAnalysis from './pages/SoilAnalysis.js';
import MarketTrends from './components/MarketTrends.js';
import DataInputForm from './components/DataInputForm.js';
import './App.css';
import CropRecommendationsProvider from './contexts/CropRecommendationsContext.js';
import { fetchWeatherData } from './utils/supabaseService.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import reportWebVitals from './reportWebVitals.js';

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
    <ErrorBoundary>
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
