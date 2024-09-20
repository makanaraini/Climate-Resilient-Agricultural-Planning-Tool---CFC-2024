import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Add this import

const PestDiseasePrediction = () => {
  const { user } = useAuth(); // Add this line
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
    <Box>
      <Typography variant="h6">Pest and Disease Prediction</Typography>
      {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Crop"
          name="crop"
          value={formData.crop}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Temperature (°C)"
          name="temperature"
          type="number"
          value={formData.temperature}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Humidity (%)"
          name="humidity"
          type="number"
          value={formData.humidity}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Predicting...' : 'Predict Risks'}
        </Button>
      </form>
      {predictions.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1">Potential Risks:</Typography>
          <List>
            {predictions.map((prediction, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={prediction.name} 
                  secondary={`Risk Level: ${prediction.risk_level === 1 ? 'High' : 'Medium'}`} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {predictions.length === 0 && !isLoading && <Typography mt={2}>No significant risks predicted.</Typography>}
    </Box>
  );
};

export default PestDiseasePrediction;
