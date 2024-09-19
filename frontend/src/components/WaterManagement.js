import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

const WaterManagement = () => {
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');
  const [days, setDays] = useState('');
  const [expectedRainfall, setExpectedRainfall] = useState('');
  const [waterPlan, setWaterPlan] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
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
    }
  };

  return (
    <Box>
      <Typography variant="h6">Water Management Plan</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Crop"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Area (hectares)"
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Number of Days"
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Expected Rainfall (mm)"
          type="number"
          value={expectedRainfall}
          onChange={(e) => setExpectedRainfall(e.target.value)}
          required
          margin="normal"
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Calculate Water Needs
        </Button>
      </form>
      {waterPlan && (
        <Box mt={2}>
          <Typography variant="subtitle1">Water Management Plan:</Typography>
          <Typography>Total Water Need: {waterPlan.total_water_need} liters</Typography>
          <Typography>Expected Rainfall: {waterPlan.expected_rainfall} liters</Typography>
          <Typography>Irrigation Need: {waterPlan.irrigation_need} liters</Typography>
          <Typography>Daily Irrigation: {waterPlan.daily_irrigation} liters</Typography>
        </Box>
      )}
    </Box>
  );
};

export default WaterManagement;
