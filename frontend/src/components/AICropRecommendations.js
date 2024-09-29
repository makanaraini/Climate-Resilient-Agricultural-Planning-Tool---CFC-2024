import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { getAICropRecommendations } from '../services/aiRecommendationService.js.js';
import { getWeatherForecast } from '../utils/weatherApiClient.js.js';
import { analyzeSoil } from '../utils/SoilUtil.js.js';
import { findSuitableCrops } from '../utils/supabaseClient.js.js';
import { generateAIPrompt } from '../utils/generateAIPrompt.js.js';

const AICropRecommendations = ({ farmData }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const weatherData = await getWeatherForecast(farmData.latitude, farmData.longitude);
        const soilData = analyzeSoil(farmData.soilData);
        const suitableCrops = findSuitableCrops({ temp: weatherData.avgTemp, rainfall: weatherData.totalRainfall });
        const prompt = generateAIPrompt(farmData, weatherData, soilData);
        
        const aiRecommendations = await getAICropRecommendations(prompt);
        setRecommendations(aiRecommendations);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [farmData]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI Crop Recommendations
        </Typography>
        <List>
          {recommendations.map((recommendation, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={recommendation.crop}
                secondary={`Confidence: ${recommendation.confidence}%, Reason: ${recommendation.reason}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AICropRecommendations;
