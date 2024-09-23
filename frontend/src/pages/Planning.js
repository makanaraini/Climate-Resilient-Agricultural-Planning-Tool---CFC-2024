import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Grid, Paper, TextField, Button, List, ListItem, ListItemText, Tab, Tabs } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import { getWeatherForecast } from '../utils/weatherApiClient';
import WeatherWidget from '../components/WeatherWidget';
import CropRecommendations from '../components/CropRecommendations';
import CropCalendar from '../components/CropCalendar';
import PlantingRecommendations from '../components/PlantingRecommendations';
import Notifications from '../components/Notifications';
import SoilAnalysis from '../components/SoilAnalysis';
import PestDiseasePrediction from '../components/PestDiseasePrediction';
import WaterManagement from '../components/WaterManagement';

function Planning() {
  const [tabValue, setTabValue] = useState(0);
  const [plans, setPlans] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [crops, setCrops] = useState([]);

  const fetchPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('plans').select('*');
      if (error) throw error;
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  }, []);

  const fetchWeatherForecast = useCallback(async () => {
    try {
      const forecast = await getWeatherForecast();
      setWeatherForecast(forecast);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
    }
  }, []);

  const fetchCrops = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('crops').select('*');
      if (error) throw error;
      setCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchWeatherForecast();
    fetchCrops();
  }, [fetchPlans, fetchWeatherForecast, fetchCrops]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Crop Planning</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Notifications weatherData={weatherForecast} crops={crops} />
        </Grid>
        <Grid item xs={12}>
          <PlantingRecommendations weatherForecast={weatherForecast} crops={crops} />
        </Grid>
        <Grid item xs={12}>
          <PestDiseasePrediction />
        </Grid>
        <Grid item xs={12}>
          <WaterManagement />
        </Grid>
        <Grid item xs={12}>
          <SoilAnalysis />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Crop Plans</Typography>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="List View" />
              <Tab label="Calendar View" />
            </Tabs>
            {tabValue === 0 ? (
              <List>
                {plans.map((plan) => (
                  <ListItem key={plan.id}>
                    <ListItemText primary={plan.name} secondary={plan.description} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <CropCalendar 
                plans={plans} 
                onUpdatePlan={fetchPlans} 
                weatherForecast={weatherForecast}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Planning;
