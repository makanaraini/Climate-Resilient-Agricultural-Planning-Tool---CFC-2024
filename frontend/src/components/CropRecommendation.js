import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const CropRecommendation = () => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soilPh, setSoilPh] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/crop-recommendation', 
        { temperature: parseFloat(temperature), humidity: parseFloat(humidity), soil_ph: parseFloat(soilPh) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Get Crop Recommendations</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Temperature (°C)"
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Humidity (%)"
          type="number"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Soil pH"
          type="number"
          value={soilPh}
          onChange={(e) => setSoilPh(e.target.value)}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Get Recommendations
        </Button>
      </form>
      {recommendations.length > 0 && (
        <div>
          <Typography variant="h6">Recommended Crops:</Typography>
          <List>
            {recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${rec.crop} (Score: ${rec.score}%)`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
