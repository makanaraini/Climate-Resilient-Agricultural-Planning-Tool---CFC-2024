import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Removed .js extension
import CssBaseline from '@mui/material/CssBaseline'; // Removed .js extension
import { AuthProvider } from './contexts/AuthContext'; // Removed .js extension
import PrivateRoute from './components/PrivateRoute'; // Removed .js extension
import Navbar from './components/Navbar'; // Removed .js extension
import Home from './pages/Home'; // Removed .js extension
import Login from './components/Login'; // Removed .js extension
import Register from './components/Register'; // Removed .js extension
import Profile from './pages/Profile'; // Removed .js extension
import Reports from './pages/Reports'; // Removed .js extension
import Planning from './pages/Planning'; // Removed .js extension
import Dashboard from './pages/Dashboard'; // Removed .js extension
import SoilAnalysis from './pages/SoilAnalysis'; // Removed .js extension
import MarketTrends from './components/MarketTrends'; // Removed .js extension
import DataInputForm from './components/DataInputForm'; // Removed .js extension
import './App.css';
import CropRecommendationsProvider from './contexts/CropRecommendationsContext'; // Removed .js extension
import { fetchWeatherData } from './utils/supabaseService'; // Removed .js extension
import ErrorBoundary from './components/ErrorBoundary'; // Removed .js extension
import reportWebVitals from './reportWebVitals'; // Removed .js extension

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
