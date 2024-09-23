import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import WeatherWidget from '../components/WeatherWidget';
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

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch data from your Supabase tables
        const { data: cropsData, error: cropsError } = await supabase
          .from('crops')
          .select('*');

        if (cropsError) throw cropsError;

        // Calculate dashboard metrics
        const totalCrops = cropsData.length;
        const averageYield = cropsData.reduce((sum, crop) => sum + (crop.yield || 0), 0) / totalCrops;
        const waterUsage = cropsData.reduce((sum, crop) => sum + (crop.water_requirements || 0), 0);

        setDashboardData({
          totalCrops,
          averageYield: averageYield.toFixed(2),
          waterUsage: waterUsage.toFixed(2),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

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
      </Grid>
    </Box>
  );
}

export default Dashboard;