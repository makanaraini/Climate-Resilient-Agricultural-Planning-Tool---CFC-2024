import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, Alert, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import BugReportIcon from '@mui/icons-material/BugReport';

const PestDiseasePrediction = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    crop: '',
    temperature: '',
    humidity: ''
  });
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to use this feature.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/pest-disease-prediction', 
        { 
          crop: formData.crop, 
          temperature: parseFloat(formData.temperature), 
          humidity: parseFloat(formData.humidity)
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching pest/disease predictions:', error);
      setError('Failed to fetch predictions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <Paper elevation={3} className="p-6 rounded-lg shadow-lg bg-white">
        <Typography variant="h4" className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BugReportIcon className="mr-2 text-green-600" />
          Pest and Disease Prediction
        </Typography>
        {error && <Alert severity="error" className="mt-4 mb-4">{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <TextField
            label="Temperature (°C)"
            name="temperature"
            type="number"
            value={formData.temperature}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <TextField
            label="Humidity (%)"
            name="humidity"
            type="number"
            value={formData.humidity}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 transition-colors duration-300"
          >
            {isLoading ? 'Predicting...' : 'Predict Risks'}
          </Button>
        </form>
        {predictions.length > 0 && (
          <Box className="mt-6">
            <Typography variant="h6" className="text-xl font-semibold text-gray-700 mb-4">
              Potential Risks:
            </Typography>
            <List className="bg-gray-50 rounded-md">
              {predictions.map((prediction, index) => (
                <ListItem key={index} className="border-b border-gray-200 last:border-b-0">
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" className="font-medium text-gray-800">
                        {prediction.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" className={`mt-1 ${prediction.risk_level === 1 ? 'text-red-600' : 'text-yellow-600'}`}>
                        Risk Level: {prediction.risk_level === 1 ? 'High' : 'Medium'}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {predictions.length === 0 && !isLoading && (
          <Typography className="mt-4 text-gray-600 italic">
            No significant risks predicted.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PestDiseasePrediction;
