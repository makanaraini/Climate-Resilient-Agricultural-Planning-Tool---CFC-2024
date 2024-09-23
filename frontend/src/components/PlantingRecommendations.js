import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

function PlantingRecommendations({ weatherForecast, crops }) {
  const generateRecommendations = () => {
    const recommendations = [];

    crops.forEach(crop => {
      const optimalTemp = crop.optimal_temperature;
      const optimalRainfall = crop.optimal_rainfall;

      const suitableDays = weatherForecast.filter(forecast => {
        const temp = forecast.main.temp;
        const rainfall = forecast.rain ? forecast.rain['3h'] : 0;
        return Math.abs(temp - optimalTemp) <= 5 && Math.abs(rainfall - optimalRainfall) <= 10;
      });

      if (suitableDays.length > 0) {
        const bestDay = suitableDays[0];
        recommendations.push({
          crop: crop.name,
          date: new Date(bestDay.dt * 1000).toLocaleDateString(),
          reason: `Optimal conditions: Temperature around ${optimalTemp}°C and rainfall around ${optimalRainfall}mm`
        });
      }
    });

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Planting Recommendations</Typography>
      {recommendations.length > 0 ? (
        <List>
          {recommendations.map((rec, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${rec.crop}: Plant on ${rec.date}`}
                secondary={rec.reason}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No recommendations available at this time.</Typography>
      )}
    </Paper>
  );
}

export default PlantingRecommendations;
