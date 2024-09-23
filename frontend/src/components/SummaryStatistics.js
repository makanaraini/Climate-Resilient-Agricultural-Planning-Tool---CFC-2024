import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

function SummaryStatistics({ weatherData, cropData }) {
  const averageTemperature = weatherData.reduce((sum, data) => sum + data.temperature_max, 0) / weatherData.length;
  const totalPrecipitation = weatherData.reduce((sum, data) => sum + data.precipitation, 0);
  const averageYield = cropData.reduce((sum, crop) => sum + (crop.yield || 0), 0) / cropData.length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Average Temperature</Typography>
          <Typography variant="h4">{averageTemperature.toFixed(2)} °C</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Total Precipitation</Typography>
          <Typography variant="h4">{totalPrecipitation.toFixed(2)} mm</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Average Crop Yield</Typography>
          <Typography variant="h4">{averageYield.toFixed(2)} tons</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SummaryStatistics;
