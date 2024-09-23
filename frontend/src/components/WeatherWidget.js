import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { getWeatherForecast } from '../utils/weatherApiClient';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // You should replace these with the actual coordinates of the farm
        const lat = 33.74;
        const lon = -84.39;
        const data = await getWeatherForecast(lat, lon);
        console.log('Received weather data:', data); // Add this line for debugging
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Failed to fetch weather data: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!weather || !weather.list) return <Typography>No weather data available</Typography>;

  // OpenWeatherMap provides forecast data in 3-hour intervals
  const dailyForecasts = weather.list.filter((item, index) => index % 8 === 0).slice(0, 3);

  return (
    <Box>
      <Typography variant="h6">3-Day Weather Forecast</Typography>
      {dailyForecasts.map((forecast, index) => (
        <Box key={index} mt={2}>
          <Typography variant="subtitle1">
            {new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
          </Typography>
          <Typography>Temperature: {forecast.main.temp}°C</Typography>
          <Typography>Feels Like: {forecast.main.feels_like}°C</Typography>
          <Typography>Humidity: {forecast.main.humidity}%</Typography>
          <Typography>Description: {forecast.weather[0].description}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default WeatherWidget;
