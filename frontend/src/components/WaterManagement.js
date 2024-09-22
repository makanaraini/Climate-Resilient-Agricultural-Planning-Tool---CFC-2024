import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { WaterDrop, Grass, Straighten, CalendarToday, Cloud } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const WaterManagement = () => {
  const { user } = useAuth();
  
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');
  const [days, setDays] = useState('');
  const [expectedRainfall, setExpectedRainfall] = useState('');
  const [waterPlan, setWaterPlan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crop || area <= 0 || days <= 0 || expectedRainfall < 0) {
      setError('Please fill all fields with valid values.');
      return;
    }
    if (!user) {
      setError('You must be logged in to use this feature.');
      return;
    }
    setIsLoading(true);
    try {
      const token = user.token;
      const response = await axios.post('http://localhost:5000/api/water-management', 
        { 
          crop, 
          area: parseFloat(area), 
          days: parseInt(days), 
          expected_rainfall: parseFloat(expectedRainfall) 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWaterPlan(response.data);
    } catch (error) {
      console.error('Error fetching water management plan:', error);
      setError('Failed to fetch water management plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} className="p-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg">
      <Typography variant="h4" className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <WaterDrop className="mr-2 text-blue-600" />
        Water Management Plan
      </Typography>
      {error && <Typography color="error" className="mb-4 p-2 bg-red-100 rounded-md">{error}</Typography>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
              InputProps={{
                startAdornment: <Grass className="mr-2 text-green-600" />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Area (hectares)"
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
              InputProps={{
                startAdornment: <Straighten className="mr-2 text-yellow-600" />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Number of Days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
              InputProps={{
                startAdornment: <CalendarToday className="mr-2 text-purple-600" />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Expected Rainfall (mm)"
              type="number"
              value={expectedRainfall}
              onChange={(e) => setExpectedRainfall(e.target.value)}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
              InputProps={{
                startAdornment: <Cloud className="mr-2 text-blue-600" />,
              }}
            />
          </Grid>
        </Grid>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={isLoading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          fullWidth
        >
          {isLoading ? <CircularProgress size={24} className="text-white" /> : 'Calculate Water Needs'}
        </Button>
      </form>
      {waterPlan && (
        <Box mt={4} p={3} className="bg-white rounded-lg shadow-md">
          <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-3">Water Management Plan Results:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography className="text-gray-700"><strong>Total Water Need:</strong> {waterPlan.total_water_need} liters</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="text-gray-700"><strong>Expected Rainfall:</strong> {waterPlan.expected_rainfall} liters</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="text-gray-700"><strong>Irrigation Need:</strong> {waterPlan.irrigation_need} liters</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="text-gray-700"><strong>Daily Irrigation:</strong> {waterPlan.daily_irrigation} liters</Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default WaterManagement;
