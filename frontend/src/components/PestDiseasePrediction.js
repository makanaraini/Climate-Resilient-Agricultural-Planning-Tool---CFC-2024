import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const PestDiseasePrediction = () => {
  const [crop, setCrop] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [predictions, setPredictions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/pest-disease-prediction', 
        { 
          crop, 
          temperature: parseFloat(temperature), 
          humidity: parseFloat(humidity)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching pest/disease predictions:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Pest and Disease Prediction</Typography>
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
          label="Temperature (°C)"
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Humidity (%)"
          type="number"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          required
          margin="normal"
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Predict Risks
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
      {predictions.length === 0 && <Typography mt={2}>No significant risks predicted.</Typography>}
    </Box>
  );
};

export default PestDiseasePrediction;
