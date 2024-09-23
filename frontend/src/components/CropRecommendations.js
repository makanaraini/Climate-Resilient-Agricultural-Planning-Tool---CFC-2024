import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, TextField, Button, Box, CircularProgress } from '@mui/material';
import { getWeatherForecast } from '../utils/weatherApiClient';
import { supabase } from '../utils/supabaseClient';

function CropRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('');

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const lat = 33.74; // Replace with actual farm coordinates
      const lon = -84.39;
      const weatherData = await getWeatherForecast(lat, lon);
      const { data: cropData, error: cropError } = await supabase
        .from('crops')
        .select('*');

      if (cropError) throw cropError;

      const newRecommendations = generateRecommendations(weatherData, cropData, soilType, season);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to fetch crop recommendations');
    } finally {
      setLoading(false);
    }
  }, [soilType, season]); // Add dependencies here

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const generateRecommendations = (weatherData, cropData, soilType, season) => {
    const avgTemp = weatherData.list.reduce((sum, item) => sum + item.main.temp, 0) / weatherData.list.length;
    const totalRain = weatherData.list.reduce((sum, item) => sum + (item.rain ? item.rain['3h'] : 0), 0);

    let recommendations = [];

    if (avgTemp > 25 && totalRain < 10) {
      recommendations.push('Consider drought-resistant crops');
      recommendations.push('Implement water conservation techniques');
    } else if (avgTemp > 20 && totalRain > 20) {
      recommendations.push('Conditions are suitable for water-intensive crops');
    } else if (avgTemp < 15) {
      recommendations.push('Focus on cold-weather crops');
    }

    if (soilType === 'clay') {
      recommendations.push('Choose crops that thrive in clay soils, like wheat or beans');
    } else if (soilType === 'sandy') {
      recommendations.push('Consider crops that do well in sandy soils, like carrots or potatoes');
    }

    if (season === 'spring') {
      recommendations.push('Good time for planting most crops');
    } else if (season === 'fall') {
      recommendations.push('Consider planting cover crops to improve soil health');
    }

    // Add recommendations based on historical crop performance
    const bestPerformingCrops = cropData
      .sort((a, b) => b.yield - a.yield)
      .slice(0, 3)
      .map(crop => crop.name);
    recommendations.push(`Based on historical data, consider planting: ${bestPerformingCrops.join(', ')}`);

    return recommendations;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Crop Recommendations</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <TextField
          select
          label="Soil Type"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
          sx={{ mr: 2, mb: 2 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Select...</option>
          <option value="clay">Clay</option>
          <option value="sandy">Sandy</option>
          <option value="loam">Loam</option>
        </TextField>
        <TextField
          select
          label="Season"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          sx={{ mr: 2, mb: 2 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Select...</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
          <option value="winter">Winter</option>
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Update Recommendations
        </Button>
      </Box>
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
