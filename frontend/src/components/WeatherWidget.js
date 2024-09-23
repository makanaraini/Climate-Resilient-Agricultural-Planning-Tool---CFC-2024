import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getWeatherForecast } from '../utils/weatherApiClient';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from 'weather-icons-react';

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

  const getWeatherIcon = (description) => {
    switch (description) {
      case 'clear sky':
        return <WiDaySunny size={24} />;
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return <WiCloud size={24} />;
      case 'shower rain':
      case 'rain':
        return <WiRain size={24} />;
      case 'thunderstorm':
        return <WiThunderstorm size={24} />;
      case 'snow':
        return <WiSnow size={24} />;
      default:
        return <WiCloud size={24} />;
    }
  };

  return (
    <Box 
      sx={{ 
        p: 3, 
        backgroundColor: '#f5f5dc', // Light beige background
        borderRadius: 2, 
        boxShadow: 3, 
        color: '#2e7d32' // Dark green text
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>3-Day Weather Forecast</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Temperature</TableCell>
              <TableCell>Feels Like</TableCell>
              <TableCell>Humidity</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailyForecasts.map((forecast, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
                </TableCell>
                <TableCell>{forecast.main.temp}°C</TableCell>
                <TableCell>{forecast.main.feels_like}°C</TableCell>
                <TableCell>{forecast.main.humidity}%</TableCell>
                <TableCell>
                  {getWeatherIcon(forecast.weather[0].description)} {forecast.weather[0].description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default WeatherWidget;
