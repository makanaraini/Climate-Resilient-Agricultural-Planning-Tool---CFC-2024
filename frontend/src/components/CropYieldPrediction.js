import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../utils/supabaseClient'; // Ensure this path is correct
import AgricultureIcon from '@mui/icons-material/Agriculture';
import axios from 'axios';  // Import axios for making API requests

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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeatherDataLoading, setIsWeatherDataLoading] = useState(true);

  // Fetch historical data from Supabase
  const fetchHistoricalData = async () => {
    try {
      // Fetch weather data
      const { data: weatherData, error: weatherError } = await supabase
        .from('weather_data')
        .select('date, temperature, precipitation');
      
      // Fetch crop data (Ensure field names match your table)
      const { data: cropData, error: cropError } = await supabase
        .from('crop_data')
        .select('crop_type, growth_cycle_days, water_requirements'); // Use 'crop_type' instead of 'crop_name'

      // Fetch historical yield data
      const yieldData = await fetchHistoricalYieldData();

      // Handle any errors from fetching
      if (weatherError || cropError) {
        throw new Error('Error fetching weather or crop data');
      }

      // Return all data if successful
      return {
        weatherData,
        cropData,
        yieldData,
      };

    } catch (error) {
      console.error('Error querying historical data:', error);
      return null; // Ensure the function returns null in case of an error
    }
  };

  // Fetch historical yield data
  async function fetchHistoricalYieldData() {
    try {
      const { data, error } = await supabase
        .from('historical_yield_data')
        .select('year, crop_id, location, yield, factors_affecting_yield')
        .order('year', { ascending: true });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching historical yield data:', error.message);
      return []; // Return an empty array in case of an error
    }
  }

  // Preprocess data before sending it to Watsonx.ai
  const preprocessData = (data) => {
    // Handle missing values, remove duplicates, normalize
    return data.map(item => ({
      date: item.date,
      temperature: parseFloat(item.temperature) || 25,  // Default values
      precipitation: parseFloat(item.precipitation) || 50,
    }));
  };

  const predictYieldFromWatson = async (processedData) => {
    try {
      const response = await axios.post('https://eu-gb.ml.cloud.ibm.com', {
        data: processedData
      }, {
        headers: {
          'Authorization': `Bearer Q9G-adhcsG9PgyuKhIqw-Xpk0RAmXSA0g0Kt4fvzSPjY`
        }
      });
      
      // Assuming the API returns predictions, we'll adjust them based on temperature
      const adjustedPredictions = response.data.predictions.map(pred => {
        const tempFactor = calculateTemperatureFactor(pred.temperature, processedData.cropData.optimal_temperature);
        return {
          ...pred,
          predictedYield: pred.predictedYield * tempFactor
        };
      });
      
      setPredictions(adjustedPredictions);
    } catch (error) {
      console.error('Error fetching predictions from Watsonx.ai:', error);
      setError('Failed to fetch predictions.');
    }
  };

  const calculateTemperatureFactor = (actualTemp, optimalTemp) => {
    const tempDiff = Math.abs(actualTemp - optimalTemp);
    if (tempDiff <= 5) return 1; // Optimal range
    if (tempDiff <= 10) return 0.9; // Slightly suboptimal
    if (tempDiff <= 15) return 0.7; // Suboptimal
    return 0.5; // Very suboptimal
  };

  // Function to initiate the prediction process
  const initiatePrediction = useCallback(async () => {
    const historicalData = await fetchHistoricalData();
    if (historicalData) {
      const processedWeatherData = preprocessData(historicalData.weatherData);
      const processedYieldData = preprocessData(historicalData.yieldData);
      await predictYieldFromWatson({
        weatherData: processedWeatherData,
        yieldData: processedYieldData,
        cropData: historicalData.cropData.find(crop => crop.crop_type === selectedCrop)
      });
    }
  }, [selectedCrop]);

  // Fetch crops from Supabase
  const fetchCrops = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crop_data')
        .select('crop_type, growth_cycle_days, water_requirements')
        .order('crop_type', { ascending: true });

      if (error) throw error;

      const uniqueCrops = [...new Set(data.map(item => item.crop_type))];
      setCrops(uniqueCrops);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setError('Failed to fetch crops.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch crops on mount
  useEffect(() => {
    fetchCrops();
  }, []);

  // When the weather data is ready, start prediction
  useEffect(() => {
    if (weatherData && weatherData.length > 0) {
      setIsWeatherDataLoading(false);
      initiatePrediction();
    }
  }, [weatherData, initiatePrediction]);

  // Fetch historical data and initiate prediction when selectedCrop changes
  useEffect(() => {
    if (selectedCrop && !isWeatherDataLoading) {
      initiatePrediction();
    }
  }, [selectedCrop, isWeatherDataLoading, initiatePrediction]);

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <AgricultureIcon sx={{ mr: 1 }} />
        Crop Yield Prediction
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {/* Crop Selection */}
      {isLoading ? (
        <Typography>Loading crops...</Typography>
      ) : (
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
      )}
      {/* Predictions Visualization */}
      {predictions.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={predictions}
                onMouseMove={(e) => {
                  if (e && e.activePayload) {
                    console.log('Tooltip data:', e.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value;
                    return (
                      <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
                        <p>{`Date: ${label}`}</p>
                        <p>{`Predicted Yield: ${typeof value === 'number' && !isNaN(value) ? `${value.toFixed(2)} kg/hectare` : 'N/A'}`}</p>
                        <p>{`Temperature: ${payload[0].payload.temperature}°C`}</p>
                      </div>
                    );
                  }
                  return null;
                }}/>
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predictedYield" 
                  stroke="#8884d8" 
                  name="Predicted Yield (kg/hectare)"
                  dot={({ cx, cy, payload }) => {
                    if (typeof payload.predictedYield !== 'number' || isNaN(payload.predictedYield)) {
                      return null;
                    }
                    return (
                      <circle cx={cx} cy={cy} r={4} fill="#8884d8" />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      )}
    </StyledPaper>
  );
}

CropYieldPrediction.propTypes = {
  weatherData: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    temperature: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    precipitation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
};

export default CropYieldPrediction;