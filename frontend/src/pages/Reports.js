import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Grid, Paper, CircularProgress, TextField, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { supabase } from '../utils/supabaseClient';
import ChartWrapper from '../components/ChartWrapper';
import DataExport from '../components/DataExport';
import WeatherDetails from '../components/WeatherDetails';
import SummaryStatistics from '../components/SummaryStatistics';
import DataTable from '../components/DataTable';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.default,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

function Reports() {
  const [weatherData, setWeatherData] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let weatherQuery = supabase.from('weather_data').select('*').order('date', { ascending: true });
        let cropQuery = supabase.from('crops').select('*');

        if (startDate) {
          weatherQuery = weatherQuery.gte('date', startDate);
        }
        if (endDate) {
          weatherQuery = weatherQuery.lte('date', endDate);
        }

        const [weatherResponse, cropResponse] = await Promise.all([weatherQuery, cropQuery]);

        if (weatherResponse.error) throw weatherResponse.error;
        if (cropResponse.error) throw cropResponse.error;

        setWeatherData(weatherResponse.data);
        setCropData(cropResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]); // Removed fetchData from dependencies

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
  if (error) return <Typography color="error" align="center" sx={{ mt: 5 }}>{error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Farm Reports
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            label="Start Date"
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            label="End Date"
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            variant="outlined"
          />
        </Grid>
      </Grid>
      <SummaryStatistics weatherData={weatherData} cropData={cropData} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <ChartWrapper 
              data={weatherData}
              xAxis="date"
              yAxis="temperature_max"
              title="Temperature Trends"
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <ChartWrapper 
              data={weatherData}
              xAxis="date"
              yAxis="precipitation"
              title="Precipitation Trends"
              chartType="bar"
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <WeatherDetails data={weatherData} />
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" color="primary" gutterBottom>Weather Data</Typography>
            <DataTable data={weatherData} columns={['date', 'temperature_max', 'precipitation']} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" color="primary" gutterBottom>Crop Data</Typography>
            <DataTable data={cropData} columns={['crop_name', 'yield', 'date']} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <DataExport weatherData={weatherData} cropData={cropData} />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;