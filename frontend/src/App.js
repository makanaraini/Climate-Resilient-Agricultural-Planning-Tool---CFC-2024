import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles.js'; // Add .js extension
import CssBaseline from '@mui/material/CssBaseline.js'; // Add .js extension
import { AuthProvider } from './contexts/AuthContext.js'; // Add .js extension
import PrivateRoute from './components/PrivateRoute.js'; // Add .js extension
import Navbar from './components/Navbar.js'; // Add .js extension
import Home from './pages/Home.js'; // Add .js extension
import Login from './components/Login.js'; // Add .js extension
import Register from './components/Register.js'; // Add .js extension
import Profile from './pages/Profile.js'; // Add .js extension
import Reports from './pages/Reports.js'; // Add .js extension
import Planning from './pages/Planning.js'; // Add .js extension
import Dashboard from './pages/Dashboard.js'; // Add .js extension
import SoilAnalysis from './pages/SoilAnalysis.js'; // Add .js extension
import MarketTrends from './components/MarketTrends.js'; // Add .js extension
import DataInputForm from './components/DataInputForm.js'; // Add .js extension
import './App.css';
import CropRecommendationsProvider from './contexts/CropRecommendationsContext.js'; // Add .js extension
import { fetchWeatherData } from './utils/supabaseService.js'; // Add .js extension
import ErrorBoundary from './components/ErrorBoundary.js'; // Add .js extension
import reportWebVitals from './reportWebVitals.js'; // Add .js extension

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
