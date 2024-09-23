import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { getWeatherForecast } from '../utils/weatherApiClient';
import { supabase } from '../utils/supabaseClient';
import { geocodeLocation } from '../utils/geocodeApiClient'; // Import your geocoding API client
import DataInputForm from './DataInputForm'; // Import DataInputForm

function CropRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [region, setRegion] = useState('');
  const [altitude, setAltitude] = useState('');

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const { lat, lon } = await geocodeLocation(location); // Get coordinates from location
      const weatherData = await getWeatherForecast(lat, lon);
      const { data: cropData, error: cropError } = await supabase
        .from('crops')
        .select('*');

      if (cropError) throw cropError;

      const newRecommendations = generateRecommendations(weatherData, cropData, soilType, region, altitude);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to fetch crop recommendations');
    } finally {
      setLoading(false);
    }
  }, [location, soilType, region, altitude]); // Add dependencies here

  useEffect(() => {
    if (location) {
      fetchRecommendations();
    }
  }, [fetchRecommendations]);

  const generateRecommendations = (weatherData, cropData, soilType, region, altitude) => {
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

    // Add region-specific recommendations
    if (region === 'north') {
      recommendations.push('Consider cold-resistant crops for northern regions');
    } else if (region === 'south') {
      recommendations.push('Consider heat-tolerant crops for southern regions');
    } else if (region === 'east') {
      recommendations.push('Consider crops that can handle high humidity for eastern regions');
    } else if (region === 'west') {
      recommendations.push('Consider drought-resistant crops for western regions');
    }

    // Add altitude-specific recommendations
    if (altitude === 'low') {
      recommendations.push('Consider crops that thrive in low altitude areas');
    } else if (altitude === 'medium') {
      recommendations.push('Consider crops suitable for medium altitude areas');
    } else if (altitude === 'high') {
      recommendations.push('Consider crops that can grow in high altitude areas');
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

  if (loading) return <CircularProgress sx={{ color: '#2e7d32' }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: '#f5f5dc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>Crop Recommendations</Typography>
      <DataInputForm
        location={location}
        setLocation={setLocation}
        soilType={soilType}
        setSoilType={setSoilType}
        region={region}
        setRegion={setRegion}
        altitude={altitude}
        setAltitude={setAltitude}
        handleSubmit={handleSubmit}
      />
      <List>
        {recommendations.map((recommendation, index) => (
          <ListItem key={index} sx={{ backgroundColor: '#e0e0d1', borderRadius: 1, mb: 1 }}>
            <ListItemText primary={recommendation} sx={{ color: '#2e7d32' }} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default CropRecommendations;
