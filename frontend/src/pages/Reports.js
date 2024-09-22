import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import ChartWrapper from '../components/ChartWrapper';
import DataExport from '../components/DataExport';
import WeatherDetails from '../components/WeatherDetails';

function Reports() {
  const [weatherData, setWeatherData] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [weatherResponse, cropResponse] = await Promise.all([
          supabase.from('weather_data').select('*').order('date', { ascending: true }),
          supabase.from('crops').select('*')
        ]);

        if (weatherResponse.error) throw weatherResponse.error;
        if (cropResponse.error) throw cropResponse.error;

        setWeatherData(weatherResponse.data);
        setCropData(cropResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farm Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <ChartWrapper 
              data={weatherData}
              xAxis="date"
              yAxis="temperature_max"
              title="Temperature Trends"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <ChartWrapper 
              data={weatherData}
              xAxis="date"
              yAxis="precipitation"
              title="Precipitation Trends"
              chartType="bar"
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <WeatherDetails data={weatherData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <DataExport weatherData={weatherData} cropData={cropData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;