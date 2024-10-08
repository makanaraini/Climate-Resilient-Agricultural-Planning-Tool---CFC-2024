import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Tab, Tabs, AppBar, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { supabase } from '../utils/supabaseClient'; // Adjust the path if necessary
import { getWeatherForecast } from '../utils/weatherApiClient';
import CropCalendar from '../components/CropCalendar';
import PlantingRecommendations from '../components/PlantingRecommendations';
import Notifications from '../components/Notifications';
import SoilAnalysis from '../components/SoilAnalysis';
import PestDiseasePrediction from '../components/PestDiseasePrediction';
import WaterManagement from '../components/WaterManagement';

const StyledBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: '#f0f8ff',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 72,
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(4),
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

function Planning() {
  const [tabValue, setTabValue] = useState(0);
  const [plans, setPlans] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [crops, setCrops] = useState([]);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');

  const fetchPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });
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
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('name', { ascending: true });
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

  const handleAddPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .insert([{ name: newPlanName, description: newPlanDescription }])
        .select();
      if (error) throw error;
      setPlans([...data, ...plans]);
      setNewPlanName('');
      setNewPlanDescription('');
    } catch (error) {
      console.error('Error adding new plan:', error);
    }
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <Notifications weatherData={weatherForecast} crops={crops} />;
      case 1:
        return <PlantingRecommendations weatherForecast={weatherForecast} crops={crops} />;
      case 2:
        return <PestDiseasePrediction />;
      case 3:
        return <WaterManagement />;
      case 4:
        return <SoilAnalysis />;
      case 5:
        return (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>Crop Plans</Typography>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <StyledTab label="List View" />
              <StyledTab label="Calendar View" />
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
            <Box mt={3}>
              <TextField
                label="New Plan Name"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Plan Description"
                value={newPlanDescription}
                onChange={(e) => setNewPlanDescription(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleAddPlan}>
                Add Plan
              </Button>
            </Box>
          </StyledPaper>
        );
      default:
        return null;
    }
  };

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 3 }}>
        Crop Planning
      </Typography>
      <StyledPaper>
        <StyledAppBar position="static">
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <StyledTab label="Notifications" />
            <StyledTab label="Planting Recommendations" />
            <StyledTab label="Pest & Disease Prediction" />
            <StyledTab label="Water Management" />
            <StyledTab label="Soil Analysis" />
            <StyledTab label="Crop Plans" />
          </Tabs>
        </StyledAppBar>
        <Box sx={{ mt: 2 }}>
          {renderTabContent()}
        </Box>
      </StyledPaper>
    </StyledBox>
  );
}

export default Planning;
