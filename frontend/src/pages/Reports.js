import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, CircularProgress, TextField } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import ChartWrapper from '../components/ChartWrapper';
import DataExport from '../components/DataExport';
import WeatherDetails from '../components/WeatherDetails';
import CropYieldPrediction from '../components/CropYieldPrediction';

function Reports() {
  const [weatherData, setWeatherData] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  async function fetchData() {
    try {
      setLoading(true);
      let weatherQuery = supabase.from('weather_data').select('*').order('date', { ascending: true });
      let cropQuery = supabase.from('crops').select('*');

      if (startDate) {
        weatherQuery = weatherQuery.gte('date', startDate);
      }
      if (endDate) {
        weatherQuery = weatherQuery.lte('date', endDate);
      }

      const [weatherResponse, cropResponse] = await Promise.all([weatherQuery, cropQuery]);

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

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farm Reports
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
      </Grid>
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
          <CropYieldPrediction weatherData={weatherData} />
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