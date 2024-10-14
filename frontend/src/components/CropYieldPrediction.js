import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, Select, MenuItem, FormControl, InputLabel, Grid, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../utils/supabaseClient'; // Ensure this path is correct
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { predictYield } from '../utils/watsonApiClient'; // Adjust the path if necessary

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

  // Constants for temperature factor calculation
  const OPTIMAL_TEMP_DIFF = 5;
  const SLIGHTLY_SUBOPTIMAL_DIFF = 10;
  const SUBOPTIMAL_DIFF = 15;

  // Fetch historical yield data
  const fetchHistoricalYieldData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('historical_yield_data')
        .select('year, crop_id, yield, factors_affecting_yield')
        .order('year', { ascending: true });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching historical yield data:', error.message);
      setError('Failed to fetch historical yield data. Please try again later.');
      return []; // Return an empty array in case of an error
    }
  }, []);

  // Fetch historical data from Supabase
  const fetchHistoricalData = useCallback(async () => {
    try {
      const [weatherResponse, cropResponse, yieldData] = await Promise.all([
        supabase.from('weather_data').select('date, temperature, precipitation'),
        supabase.from('crop_data').select('crop_type, growth_cycle_days, water_requirements'),
        fetchHistoricalYieldData(),
      ]);

      // Handle any errors from fetching
      if (weatherResponse.error || cropResponse.error) {
        throw new Error('Error fetching weather or crop data');
      }

      // Return all data if successful
      return {
        weatherData: weatherResponse.data,
        cropData: cropResponse.data,
        yieldData,
      };

    } catch (error) {
      console.error('Error querying historical data:', error);
      setError('Failed to fetch historical data. Please try again later.');
      return null; // Ensure the function returns null in case of an error
    }
  }, [fetchHistoricalYieldData]);

  // Preprocess data before sending it to Watsonx.ai
  const preprocessData = (data) => {
    return data.map(item => ({
      date: item.date,
      temperature: parseFloat(item.temperature) || 25,  // Default values
      precipitation: parseFloat(item.precipitation) || 50,
      // Include any other required fields
      crop_type: item.crop_type, // Example field
    }));
  };

  const predictYieldFromWatson = useCallback(async (processedData) => {
    try {
      const predictionData = await predictYield(processedData); // Call the Watsonx API

      // Adjust predictions based on temperature
      const adjustedPredictions = predictionData.predictions.map(pred => {
        const tempFactor = calculateTemperatureFactor(pred.temperature, processedData.cropData.optimal_temperature);
        return {
          ...pred,
          predictedYield: pred.predictedYield * tempFactor,
        };
      });

      setPredictions(adjustedPredictions);
    } catch (error) {
      console.error('Error fetching predictions from Watsonx.ai:', error);
      setError('Failed to fetch predictions. Please try again later.');
    }
  }, []);

  const calculateTemperatureFactor = (actualTemp, optimalTemp) => {
    const tempDiff = Math.abs(actualTemp - optimalTemp);
    if (tempDiff <= OPTIMAL_TEMP_DIFF) return 1; // Optimal range
    if (tempDiff <= SLIGHTLY_SUBOPTIMAL_DIFF) return 0.9; // Slightly suboptimal
    if (tempDiff <= SUBOPTIMAL_DIFF) return 0.7; // Suboptimal
    return 0.5; // Very suboptimal
  };

  // Function to initiate the prediction process
  const initiatePrediction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const historicalData = await fetchHistoricalData();
      if (historicalData) {
        const processedWeatherData = preprocessData(historicalData.weatherData);
        const processedYieldData = preprocessData(historicalData.yieldData);
        await predictYieldFromWatson({
          weatherData: processedWeatherData,
          yieldData: processedYieldData,
          cropData: historicalData.cropData.find(crop => crop.crop_type === selectedCrop),
        });
      } else {
        throw new Error('Failed to fetch historical data');
      }
    } catch (error) {
      console.error('Error during prediction process:', error);
      setError('An error occurred during the prediction process. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCrop, fetchHistoricalData, predictYieldFromWatson]);

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
      setError('Failed to fetch crops. Please try again later.');
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predictedYield" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      )}
    </StyledPaper>
  );
}

CropYieldPrediction.propTypes = {
  weatherData: PropTypes.array.isRequired,
};

export default CropYieldPrediction;