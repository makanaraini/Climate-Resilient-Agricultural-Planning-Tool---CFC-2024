import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { getWeatherForecast } from '../utils/weatherApiClient';

function CropRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        // You should replace these with the actual coordinates of the farm
        const lat = 33.74;
        const lon = -84.39;
        const weatherData = await getWeatherForecast(lat, lon);
        const cropRecommendations = generateRecommendations(weatherData);
        setRecommendations(cropRecommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch crop recommendations');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  const generateRecommendations = (weatherData) => {
    // This is a simplified recommendation logic. In a real application,
    // you'd want to use more sophisticated algorithms and consider more factors.
    const avgTemp = weatherData.list.reduce((sum, item) => sum + item.main.temp, 0) / weatherData.list.length;
    const totalRain = weatherData.list.reduce((sum, item) => sum + (item.rain ? item.rain['3h'] : 0), 0);

    if (avgTemp > 25 && totalRain < 10) {
      return ['Drought-resistant crops', 'Consider irrigation'];
    } else if (avgTemp > 20 && totalRain > 20) {
      return ['Rice', 'Leafy greens'];
    } else if (avgTemp < 15) {
      return ['Cold-weather crops like kale and spinach'];
    } else {
      return ['Diverse crop selection', 'Monitor weather closely'];
    }
  };

  if (loading) return <Typography>Loading recommendations...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Crop Recommendations</Typography>
      <List>
        {recommendations.map((recommendation, index) => (
          <ListItem key={index}>
            <ListItemText primary={recommendation} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default CropRecommendations;
