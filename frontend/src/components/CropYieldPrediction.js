import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../utils/supabaseClient'; // Ensure this path is correct
import AgricultureIcon from '@mui/icons-material/Agriculture';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.dark,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '&.MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function CropYieldPrediction({ weatherData }) {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [predictions, setPredictions] = useState([]);

  const predictYield = useCallback(() => {
    // This is a simplified prediction model. In a real-world scenario, you'd use more sophisticated methods.
    const predictions = weatherData.map(weather => {
      const predictedYield = calculatePredictedYield(weather, selectedCrop);
      return {
        date: weather.date,
        predictedYield: predictedYield
      };
    });
    setPredictions(predictions);
  }, [weatherData, selectedCrop]);

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    if (selectedCrop && weatherData.length > 0) {
      predictYield();
    }
  }, [selectedCrop, weatherData, predictYield]);

  async function fetchCrops() {
    try {
      const { data, error } = await supabase
        .from('crop_data')
        .select('crop_type')
        .distinct();
      
      if (error) throw error;
      
      setCrops(data.map(crop => crop.crop_type));
    } catch (error) {
      console.error('Error fetching crops:', error.message);
      // You might want to set an error state here and display it to the user
    }
  }

  function calculatePredictedYield(weather, crop) {
    // This is a placeholder function. Replace with actual prediction logic based on crop and weather data.
    const baseYield = 100; // Base yield in kg/hectare
    const tempFactor = 1 + (weather.temperature_max - 25) * 0.01; // Adjust based on temperature
    const rainFactor = 1 + (weather.precipitation - 50) * 0.005; // Adjust based on rainfall
    return baseYield * tempFactor * rainFactor;
  }

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <AgricultureIcon sx={{ mr: 1 }} />
        Crop Yield Prediction
      </Typography>
      <StyledFormControl fullWidth>
        <InputLabel id="crop-select-label">Select Crop</InputLabel>
        <StyledSelect
          labelId="crop-select-label"
          value={selectedCrop}
          label="Select Crop"
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          {crops.map(crop => (
            <MenuItem key={crop} value={crop}>{crop}</MenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>
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
    </StyledPaper>
  );
}

export default CropYieldPrediction;
