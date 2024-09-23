import React, { useState, useEffect } from 'react';
import { Typography, Paper, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../utils/supabaseClient';

function CropYieldPrediction({ weatherData }) {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    if (selectedCrop && weatherData.length > 0) {
      predictYield();
    }
  }, [selectedCrop, weatherData]);

  async function fetchCrops() {
    const { data, error } = await supabase.from('crops').select('name');
    if (error) console.error('Error fetching crops:', error);
    else setCrops(data.map(crop => crop.name));
  }

  function predictYield() {
    // This is a simplified prediction model. In a real-world scenario, you'd use more sophisticated methods.
    const predictions = weatherData.map(weather => {
      const predictedYield = calculatePredictedYield(weather, selectedCrop);
      return {
        date: weather.date,
        predictedYield: predictedYield
      };
    });
    setPredictions(predictions);
  }

  function calculatePredictedYield(weather, crop) {
    // This is a placeholder function. Replace with actual prediction logic based on crop and weather data.
    const baseYield = 100; // Base yield in kg/hectare
    const tempFactor = 1 + (weather.temperature_max - 25) * 0.01; // Adjust based on temperature
    const rainFactor = 1 + (weather.precipitation - 50) * 0.005; // Adjust based on rainfall
    return baseYield * tempFactor * rainFactor;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Crop Yield Prediction</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Crop</InputLabel>
        <Select
          value={selectedCrop}
          label="Select Crop"
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          {crops.map(crop => (
            <MenuItem key={crop} value={crop}>{crop}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {predictions.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predictedYield" stroke="#8884d8" name="Predicted Yield (kg/hectare)" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

export default CropYieldPrediction;
