import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Grid, Paper, CircularProgress, Tabs, Tab } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import WeatherWidget from '../components/WeatherWidget';
import CropYieldPrediction from '../components/CropYieldPrediction';
import Notifications from '../components/Notifications';
import SoilAnalysis from '../components/SoilAnalysis';
import DataCard from '../components/DataCard';
import CropRecommendation from '../components/CropRecommendations';
import DataVisualization from '../components/DataVisualization';

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
  const [tabIndex, setTabIndex] = useState(0);

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

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWeatherData(), fetchCropData()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [fetchWeatherData, fetchCropData]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farm Dashboard
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="dashboard tabs">
        <Tab label="Overview" />
        <Tab label="Weather" />
        <Tab label="Crop Recommendations" />
        <Tab label="Crop Yield Prediction" />
        <Tab label="Notifications" />
        <Tab label="Soil Analysis" />
        <Tab label="Data Visualization" />
      </Tabs>
      {tabIndex === 0 && (
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
        </Grid>
      )}
      {tabIndex === 1 && (
        <Paper sx={{ p: 2 }}>
          <WeatherWidget />
        </Paper>
      )}
      {tabIndex === 2 && (
        <Paper sx={{ p: 2 }}>
          <CropRecommendation />
        </Paper>
      )}
      {tabIndex === 3 && (
        <Paper sx={{ p: 2 }}>
          <CropYieldPrediction weatherData={weatherData} />
        </Paper>
      )}
      {tabIndex === 4 && (
        <Paper sx={{ p: 2 }}>
          <Notifications weatherData={weatherData} crops={cropData} />
        </Paper>
      )}
      {tabIndex === 5 && (
        <Paper sx={{ p: 2 }}>
          <SoilAnalysis />
        </Paper>
      )}
      {tabIndex === 6 && (
        <Paper sx={{ p: 2 }}>
          <DataVisualization agriculturalData={cropData} />
        </Paper>
      )}
    </Box>
  );
}

export default Dashboard;