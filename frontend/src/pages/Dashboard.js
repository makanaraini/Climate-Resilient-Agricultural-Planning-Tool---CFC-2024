import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Tabs,
  Tab,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient'; // Adjust the path if necessary
import WeatherWidget from '../components/WeatherWidget';
import CropYieldPrediction from '../components/CropYieldPrediction';
import Notifications from '../components/Notifications';
import DataCard from '../components/DataCard';
import CropRecommendation from '../components/CropRecommendations';
import DataVisualization from '../components/DataVisualization';

const Dashboard = () => {
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
  const [open, setOpen] = useState(false);

  const fetchWeatherData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data');
    }
  }, []);

  const fetchCropData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crop_data')
        .select('*');
      if (error) throw error;
      setCropData(data);

      const totalCrops = data.length;
      const averageYield = (
        data.reduce((sum, crop) => sum + (crop.yield || 0), 0) / totalCrops
      ).toFixed(2);
      const waterUsage = data.reduce((sum, crop) => sum + (crop.water_requirements || 0), 0);

      setDashboardData({
        totalCrops,
        averageYield,
        waterUsage: waterUsage.toFixed(2),
      });
    } catch (error) {
      console.error('Error fetching crop data:', error);
      setError('Failed to fetch crop data');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchWeatherData(), fetchCropData()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWeatherData, fetchCropData]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farm Dashboard
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Weather" />
        <Tab label="Crop Recommendations" />
        <Tab label="Crop Yield Prediction" />
        <Tab label="Notifications" />
        <Tab label="Data Visualization" />
      </Tabs>
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <DataCard
              title="Total Crops"
              value={dashboardData.totalCrops}
              isLoading={loading}
              error={error}
              icon={null}
              customStyles={{}}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataCard
              title="Average Yield"
              value={`${dashboardData.averageYield} kg/ha`}
              isLoading={loading}
              error={error}
              icon={null}
              customStyles={{}}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataCard
              title="Water Usage"
              value={`${dashboardData.waterUsage} L`}
              isLoading={loading}
              error={error}
              icon={null}
              customStyles={{}}
            />
          </Grid>
        </Grid>
      )}
      {tabIndex === 1 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <WeatherWidget />
        </Paper>
      )}
      {tabIndex === 2 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <CropRecommendation />
        </Paper>
      )}
      {tabIndex === 3 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <CropYieldPrediction weatherData={weatherData} />
        </Paper>
      )}
      {tabIndex === 4 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Notifications weatherData={weatherData} crops={cropData} />
        </Paper>
      )}
      {tabIndex === 5 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <DataVisualization agriculturalData={cropData} />
        </Paper>
      )}
      <List sx={{ mt: 2 }}>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="Expand/Collapse" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton>
              <ListItemText primary="Additional Content" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Dashboard;
