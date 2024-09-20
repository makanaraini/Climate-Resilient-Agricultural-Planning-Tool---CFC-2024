import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Add this import
import DataInputForm from '../components/DataInputForm';
import DataVisualization from '../components/DataVisualization';
import DataCard from '../components/DataCard';
import WeatherForecast from '../components/WeatherForecast';
import CropRecommendation from '../components/CropRecommendation';
import WaterManagement from '../components/WaterManagement';
import PestDiseasePrediction from '../components/PestDiseasePrediction';
import UserProfile from '../components/UserProfile';
import DataExport from '../components/DataExport';
import AICropRecommendations from '../components/AICropRecommendations';
import ReportDownload from '../components/ReportDownload';
import { Container, Button, Typography, Grid } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';

function Dashboard() { // Remove setAuth prop
  const { logout } = useAuth(); // Add this line
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [cropsData, setCropsData] = useState(null);
  const [agriculturalData, setAgriculturalData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        logout(); // Replace setAuth(false) with logout()
        navigate('/login');
        return;
      }

      try {
        const weatherResponse = await axios.get('http://localhost:5000/api/weather', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWeatherData(weatherResponse.data);

        const forecastResponse = await axios.get('http://localhost:5000/api/weather-forecast', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWeatherForecast(forecastResponse.data);

        const cropsResponse = await axios.get('http://localhost:5000/api/crops', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCropsData(cropsResponse.data);

        const agriculturalResponse = await axios.get('http://localhost:5000/api/agricultural-data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgriculturalData(agriculturalResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response && err.response.status === 401) {
          logout(); // Replace setAuth(false) with logout()
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [logout, navigate]); // Update dependencies

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout(); // Replace setAuth(false) with logout()
    navigate('/login');
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {weatherData && (
            <DataCard title="Current Weather">
              <Typography>Temperature: {weatherData.temperature}°C</Typography>
              <Typography>Humidity: {weatherData.humidity}%</Typography>
              <Typography>Precipitation: {weatherData.precipitation}mm</Typography>
            </DataCard>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {weatherForecast && (
            <DataCard title="Weather Forecast">
              <WeatherForecast forecast={weatherForecast} />
            </DataCard>
          )}
        </Grid>
        <Grid item xs={12}>
          {cropsData && (
            <DataCard title="Crops">
              <ul>
                {cropsData.map(crop => (
                  <li key={crop.id}>{crop.name} - Optimal Temp: {crop.optimal_temp}°C, Water Needs: {crop.water_needs}</li>
                ))}
              </ul>
            </DataCard>
          )}
        </Grid>
        <Grid item xs={12}>
          {agriculturalData && agriculturalData.length > 0 && (
            <DataCard title="Data Visualization">
              <ErrorBoundary>
                <DataVisualization agriculturalData={agriculturalData} />
              </ErrorBoundary>
            </DataCard>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <DataCard title="Crop Recommendation">
            <CropRecommendation />
          </DataCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DataCard title="AI Crop Recommendations">
            <AICropRecommendations />
          </DataCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DataCard title="Water Management">
            <WaterManagement />
          </DataCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DataCard title="Pest and Disease Prediction">
            <PestDiseasePrediction />
          </DataCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DataCard title="User Profile">
            <UserProfile />
          </DataCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DataCard title="Export Data">
            <DataExport />
          </DataCard>
        </Grid>
        <Grid item xs={12}>
          <DataCard title="Download Reports">
            <ReportDownload />
          </DataCard>
        </Grid>
      </Grid>
      <DataInputForm />
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}

export default Dashboard;