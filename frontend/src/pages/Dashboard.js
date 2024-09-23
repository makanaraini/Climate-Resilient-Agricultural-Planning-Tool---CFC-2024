import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import WeatherWidget from '../components/WeatherWidget';
import CropYieldPrediction from '../components/CropYieldPrediction';
import Notifications from '../components/Notifications';
import SoilAnalysis from '../components/SoilAnalysis';
import DataCard from '../components/DataCard';
import CropRecommendation from '../components/CropRecommendations';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalCrops: 0,
    averageYield: 0,
    waterUsage: 0,
  });
  const [weatherData, setWeatherData] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [soilData, setSoilData] = useState([]);

  const fetchWeatherData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('weather_data').select('*').order('date', { ascending: true });
      if (error) throw error;
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data');
    }
  }, []);

  const fetchCropData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('crops').select('*');
      if (error) throw error;
      setCropData(data);

      // Calculate dashboard metrics
      const totalCrops = data.length;
      const averageYield = data.reduce((sum, crop) => sum + (crop.yield || 0), 0) / totalCrops;
      const waterUsage = data.reduce((sum, crop) => sum + (crop.water_requirements || 0), 0);

      setDashboardData({
        totalCrops,
        averageYield: averageYield.toFixed(2),
        waterUsage: waterUsage.toFixed(2),
      });
    } catch (error) {
      console.error('Error fetching crop data:', error);
      setError('Failed to fetch crop data');
    }
  }, []);

  const fetchSoilData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('soil_analysis').select('*').order('date', { ascending: true });
      if (error) throw error;
      setSoilData(data);
    } catch (error) {
      console.error('Error fetching soil data:', error);
      setError('Failed to fetch soil data');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWeatherData(), fetchCropData(), fetchSoilData()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [fetchWeatherData, fetchCropData, fetchSoilData]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farm Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DataCard title="Total Crops" value={dashboardData.totalCrops} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DataCard title="Average Yield" value={`${dashboardData.averageYield} kg/ha`} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DataCard title="Water Usage" value={`${dashboardData.waterUsage} L`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <WeatherWidget />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <CropRecommendation />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <CropYieldPrediction weatherData={weatherData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Notifications weatherData={weatherData} crops={cropData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <SoilAnalysis />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;