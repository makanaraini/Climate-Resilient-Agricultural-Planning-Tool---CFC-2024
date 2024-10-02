import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, Box } from '@mui/material/index';
import { styled } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import SevereColdTwoToneIcon from '@mui/icons-material/SevereColdTwoTone';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const StyledList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
  },
}));

const NotificationIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

function Notifications({ weatherData, crops }) {
  const [notifications, setNotifications] = useState([]);

  const generateNotifications = useCallback(() => {
    const newNotifications = [];

    weatherData.forEach(forecast => {
      const date = new Date(forecast.date).toLocaleDateString();
      const temp = forecast.temperature_max;
      const rain = forecast.precipitation;

      if (temp > 35) {
        newNotifications.push({
          date,
          message: `Extreme heat alert: Temperature is expected to reach ${temp}°C.`,
          icon: <WbSunnyIcon />,
        });
      }

      if (rain > 100) {
        newNotifications.push({
          date,
          message: `Heavy rainfall alert: Precipitation is expected to be ${rain}mm.`,
          icon: <OpacityIcon />,
        });
      }

      crops.forEach(crop => {
        const optimalTemp = crop.optimal_temperature;
        const optimalRainfall = crop.optimal_rainfall;

        if (Math.abs(temp - optimalTemp) <= 5 && Math.abs(rain - optimalRainfall) <= 10) {
          newNotifications.push({
            date,
            message: `Optimal planting conditions for ${crop.name} on ${date}: Temperature around ${optimalTemp}°C and rainfall around ${optimalRainfall}mm.`,
            icon: <SevereColdTwoToneIcon />,
          });
        }
      });
    });

    setNotifications(newNotifications);
  }, [weatherData, crops]);

  useEffect(() => {
    generateNotifications();
  }, [weatherData, crops, generateNotifications]);

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 'bold' }}>
        <NotificationsActiveIcon sx={{ mr: 1 }} />
        Notifications
      </Typography>
      {notifications.length > 0 ? (
        <StyledList>
          {notifications.map((notification, index) => (
            <ListItem key={index}>
              <NotificationIcon>
                {notification.icon}
              </NotificationIcon>
              <ListItemText
                primary={<Typography variant="subtitle1" fontWeight="medium">{notification.message}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{`Date: ${notification.date}`}</Typography>}
              />
            </ListItem>
          ))}
        </StyledList>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
          No notifications at this time.
        </Typography>
      )}
    </StyledPaper>
  );
}

export default Notifications;
