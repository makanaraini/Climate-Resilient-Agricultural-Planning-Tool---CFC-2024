import React, { useEffect, useState } from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

function Notifications({ weatherData, crops }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    generateNotifications();
  }, [weatherData, crops]);

  const generateNotifications = () => {
    const newNotifications = [];

    weatherData.forEach(forecast => {
      const date = new Date(forecast.date).toLocaleDateString();
      const temp = forecast.temperature_max;
      const rain = forecast.precipitation;

      if (temp > 35) {
        newNotifications.push({
          date,
          message: `Extreme heat alert: Temperature is expected to reach ${temp}°C.`
        });
      }

      if (rain > 100) {
        newNotifications.push({
          date,
          message: `Heavy rainfall alert: Precipitation is expected to be ${rain}mm.`
        });
      }

      crops.forEach(crop => {
        const optimalTemp = crop.optimal_temperature;
        const optimalRainfall = crop.optimal_rainfall;

        if (Math.abs(temp - optimalTemp) <= 5 && Math.abs(rain - optimalRainfall) <= 10) {
          newNotifications.push({
            date,
            message: `Optimal planting conditions for ${crop.name} on ${date}: Temperature around ${optimalTemp}°C and rainfall around ${optimalRainfall}mm.`
          });
        }
      });
    });

    setNotifications(newNotifications);
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Notifications</Typography>
      {notifications.length > 0 ? (
        <List>
          {notifications.map((notification, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={notification.message}
                secondary={`Date: ${notification.date}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No notifications at this time.</Typography>
      )}
    </Paper>
  );
}

export default Notifications;
