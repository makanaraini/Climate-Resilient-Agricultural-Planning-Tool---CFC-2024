import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const { data, error } = await supabase
          .from('weather_data')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!weather) return <Typography>No weather data available</Typography>;

  return (
    <Box>
      <Typography variant="h6">Current Weather</Typography>
      <Typography>Temperature: {weather.temperature}°C</Typography>
      <Typography>Humidity: {weather.humidity}%</Typography>
      <Typography>Precipitation: {weather.precipitation} mm</Typography>
    </Box>
  );
}

export default WeatherWidget;
