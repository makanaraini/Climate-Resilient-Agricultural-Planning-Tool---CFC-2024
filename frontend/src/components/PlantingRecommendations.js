import React from 'react';
import { Typography, Paper, List, ListItem, Box, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { CalendarToday, Info } from '@mui/icons-material';
import SolarPowerTwoToneIcon from '@mui/icons-material/SolarPowerTwoTone';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
}));

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
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom color="primary">
        Planting Recommendations
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {recommendations.length > 0 ? (
        <List>
          {recommendations.map((rec, index) => (
            <StyledListItem key={index}>
              <Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <IconWrapper>
                    <SolarPowerTwoToneIcon/>
                  </IconWrapper>
                  <Typography variant="h6" color="primary">
                    {rec.crop}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <IconWrapper>
                    <CalendarToday />
                  </IconWrapper>
                  <Typography variant="body1">
                    Plant on {rec.date}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <IconWrapper>
                    <Info />
                  </IconWrapper>
                  <Typography variant="body2" color="text.secondary">
                    {rec.reason}
                  </Typography>
                </Box>
              </Box>
            </StyledListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No recommendations available at this time.
        </Typography>
      )}
    </StyledPaper>
  );
}

export default PlantingRecommendations;
