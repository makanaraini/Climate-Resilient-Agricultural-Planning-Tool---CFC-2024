import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataInputForm from '../components/DataInputForm';
import DataVisualization from '../components/DataVisualization';
import DataCard from '../components/DataCard';
import WeatherForecast from '../components/WeatherForecast';
import CropRecommendation from '../components/CropRecommendation';
import WaterManagement from '../components/WaterManagement';
import PestDiseasePrediction from '../components/PestDiseasePrediction';
import UserProfile from '../components/UserProfile';
import DataExport from '../components/DataExport';
import { Container, Button, Typography } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';

function Dashboard({ setAuth }) {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [cropsData, setCropsData] = useState(null);
  const [agriculturalData, setAgriculturalData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuth(false);
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
          setAuth(false);
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [setAuth, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Dashboard
      </Typography>
      {weatherData && (
        <DataCard title="Current Weather">
          <Typography>Temperature: {weatherData.temperature}°C</Typography>
          <Typography>Humidity: {weatherData.humidity}%</Typography>
          <Typography>Precipitation: {weatherData.precipitation}mm</Typography>
        </DataCard>
      )}
      {weatherForecast && (
        <DataCard title="Weather Forecast">
          <WeatherForecast forecast={weatherForecast} />
        </DataCard>
      )}
      {cropsData && (
        <DataCard title="Crops">
          <ul>
            {cropsData.map(crop => (
              <li key={crop.id}>{crop.name} - Optimal Temp: {crop.optimal_temp}°C, Water Needs: {crop.water_needs}</li>
            ))}
          </ul>
        </DataCard>
      )}
      {agriculturalData && agriculturalData.length > 0 ? (
        <DataCard title="Data Visualization">
          <ErrorBoundary>
            <DataVisualization agriculturalData={agriculturalData} />
          </ErrorBoundary>
        </DataCard>
      ) : (
        <DataCard title="Data Visualization">
          <p>No agricultural data available</p>
        </DataCard>
      )}
      <DataCard title="Crop Recommendation">
        <CropRecommendation />
      </DataCard>
      <DataCard title="Water Management">
        <WaterManagement />
      </DataCard>
      <DataCard title="Pest and Disease Prediction">
        <PestDiseasePrediction />
      </DataCard>
      <DataCard title="User Profile">
        <UserProfile />
      </DataCard>
      <DataCard title="Export Data">
        <DataExport />
      </DataCard>
      <DataInputForm />
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}

export default Dashboard;