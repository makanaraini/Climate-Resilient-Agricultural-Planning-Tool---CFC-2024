import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import WeatherWidget from '../components/WeatherWidget';
import CropRecommendations from '../components/CropRecommendations';
import CropPlanner from '../components/CropPlanner'; // Assuming you have this component

function Planning() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Crop Planning
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <WeatherWidget />
        </Grid>
        <Grid item xs={12} md={6}>
          <CropRecommendations />
        </Grid>
        <Grid item xs={12}>
          <CropPlanner />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Planning;
