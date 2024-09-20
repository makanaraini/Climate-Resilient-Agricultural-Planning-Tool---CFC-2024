import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, List, ListItem, ListItemText, Container, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Add this import

const CropRecommendation = () => {
  const { user } = useAuth(); // Add this line
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    soilPh: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('You must be logged in to get recommendations.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/crop-recommendation', 
        { 
          temperature: parseFloat(formData.temperature), 
          humidity: parseFloat(formData.humidity), 
          soil_ph: parseFloat(formData.soilPh) 
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      setError('Failed to fetch recommendations. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Get Crop Recommendations</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Temperature (°C)"
          type="number"
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Humidity (%)"
          type="number"
          name="humidity"
          value={formData.humidity}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Soil pH"
          type="number"
          name="soilPh"
          value={formData.soilPh}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Get Recommendations
        </Button>
      </form>
      {recommendations.length > 0 && (
        <div>
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Recommended Crops:</Typography>
          <List>
            {recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${rec.crop} (Score: ${rec.score}%)`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Container>
  );
};

export default CropRecommendation;
