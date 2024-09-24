import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { getWeatherForecast } from '../utils/weatherApiClient';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from 'weather-icons-react';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginTop: theme.spacing(2),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
}));

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // You should replace these with the actual coordinates of the farm
        const lat = 33.74;
        const lon = -84.39;
        const data = await getWeatherForecast(lat, lon);
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Failed to fetch weather data: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!weather || !weather.list) return <Typography>No weather data available</Typography>;

  // OpenWeatherMap provides forecast data in 3-hour intervals
  const dailyForecasts = weather.list.filter((item, index) => index % 8 === 0).slice(0, 3);

  const getWeatherIcon = (description) => {
    switch (description) {
      case 'clear sky':
        return <WiDaySunny size={24} color="#FDB813" />;
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return <WiCloud size={24} color="#A9A9A9" />;
      case 'shower rain':
      case 'rain':
        return <WiRain size={24} color="#4682B4" />;
      case 'thunderstorm':
        return <WiThunderstorm size={24} color="#FFD700" />;
      case 'snow':
        return <WiSnow size={24} color="#FFFFFF" />;
      default:
        return <WiCloud size={24} color="#A9A9A9" />;
    }
  };

  return (
    <StyledBox>
      <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
        3-Day Weather Forecast
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeadCell>Day</StyledTableHeadCell>
              <StyledTableHeadCell>Temperature</StyledTableHeadCell>
              <StyledTableHeadCell>Feels Like</StyledTableHeadCell>
              <StyledTableHeadCell>Humidity</StyledTableHeadCell>
              <StyledTableHeadCell>Description</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {dailyForecasts.map((forecast, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
                </StyledTableCell>
                <StyledTableCell>{forecast.main.temp}°C</StyledTableCell>
                <StyledTableCell>{forecast.main.feels_like}°C</StyledTableCell>
                <StyledTableCell>{forecast.main.humidity}%</StyledTableCell>
                <StyledTableCell>
                  {getWeatherIcon(forecast.weather[0].description)} {forecast.weather[0].description}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledBox>
  );
}

export default WeatherWidget;
