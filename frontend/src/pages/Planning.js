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

function Planning() {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ crop: '', area: '', planting_date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [crops, setCrops] = useState([]);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching crop plans...');
      const { data, error } = await supabase
        .from('crop_plans')
        .select('*')
        .order('planting_date', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Fetched plans:', data);
      setPlans(data || []);  // Use an empty array if data is null
      if (data && data.length === 0) {
        console.log('No crop plans found. The table might be empty.');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError(`Failed to fetch crop plans: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherForecast = useCallback(async () => {
    try {
      const lat = 33.74; // Replace with actual farm coordinates
      const lon = -84.39;
      const forecast = await getWeatherForecast(lat, lon);
      setWeatherForecast(forecast.list);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      setError('Failed to fetch weather forecast');
    }
  }, []);

  const fetchCrops = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*');

      if (error) throw error;
      setCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setError('Failed to fetch crops');
    }
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchWeatherForecast();
    fetchCrops();
  }, [fetchPlans, fetchWeatherForecast, fetchCrops]);

  const handleInputChange = (e) => {
    setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('crop_plans')
        .insert([newPlan]);

      if (error) throw error;
      setPlans([...plans, data[0]]);
      setNewPlan({ crop: '', area: '', planting_date: '' });
      fetchPlans(); // Refresh the list after adding a new plan
    } catch (error) {
      console.error('Error adding plan:', error);
      setError('Failed to add crop plan');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdatePlan = async (updatedPlan) => {
    try {
      const { data, error } = await supabase
        .from('crop_plans')
        .update(updatedPlan)
        .eq('id', updatedPlan.id);

      if (error) throw error;

      setPlans(plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
    } catch (error) {
      console.error('Error updating plan:', error);
      setError('Failed to update crop plan');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Crop Planning</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <WeatherWidget />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <CropRecommendations />
        </Grid>
        <Grid item xs={12}>
          <Notifications weatherData={weatherForecast} crops={crops} />
        </Grid>
        <Grid item xs={12}>
          <PlantingRecommendations weatherForecast={weatherForecast} crops={crops} />
        </Grid>
        <Grid item xs={12}>
          <SoilAnalysis />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Create New Crop Plan</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
              <TextField
                name="crop"
                label="Crop"
                value={newPlan.crop}
                onChange={handleInputChange}
                required
                sx={{ mr: 2, mb: 2 }}
              />
              <TextField
                name="area"
                label="Area (hectares)"
                type="number"
                value={newPlan.area}
                onChange={handleInputChange}
                required
                sx={{ mr: 2, mb: 2 }}
              />
              <TextField
                name="planting_date"
                label="Planting Date"
                type="date"
                value={newPlan.planting_date}
                onChange={handleInputChange}
                required
                sx={{ mr: 2, mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button type="submit" variant="contained" color="primary">
                Add Plan
              </Button>
            </Box>
          </Paper>
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
                    <ListItemText
                      primary={`${plan.crop} - ${plan.area} hectares`}
                      secondary={`Planting Date: ${new Date(plan.planting_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <CropCalendar 
                plans={plans} 
                onUpdatePlan={handleUpdatePlan} 
                weatherForecast={weatherForecast}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={fetchPlans} variant="outlined" color="primary" sx={{ mt: 2, mb: 2 }}>
            Refresh Crop Plans
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Planning;
