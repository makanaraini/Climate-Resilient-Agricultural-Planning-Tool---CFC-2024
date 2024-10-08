import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, List, ListItem, Box, Divider } from '@mui/material/index';
import { styled } from '@mui/system/index';
import { getWeatherForecast } from '../utils/weatherApiClient';
import { supabase } from '../utils/supabaseClient'; // Adjust the path if necessary
import { geocodeLocation } from '../utils/geocodeApiClient';
import DataInputForm from './DataInputForm';
import { AgricultureOutlined, WbSunnyOutlined, WaterDropOutlined, TerrainOutlined } from '@mui/icons-material/index';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
      const { lat, lon } = await geocodeLocation(location);
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
  }, [location, soilType, region, altitude]);

  useEffect(() => {
    if (location) {
      fetchRecommendations();
    }
  }, [location, fetchRecommendations]);

  const generateRecommendations = (weatherData, cropData, soilType, region, altitude) => {
    // ... (keep the existing generateRecommendations function)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
        Crop Recommendations
      </Typography>
      <Divider sx={{ mb: 2 }} />
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
          <StyledListItem key={index.toString()}>
            <Box>
              <Box display="flex" alignItems="center" mb={1}>
                <IconWrapper>
                  {index % 4 === 0 && <AgricultureOutlined />}
                  {index % 4 === 1 && <WbSunnyOutlined />}
                  {index % 4 === 2 && <WaterDropOutlined />}
                  {index % 4 === 3 && <TerrainOutlined />}
                </IconWrapper>
                <Typography variant="body1" color="text.primary">
                  {recommendation}
                </Typography>
              </Box>
            </Box>
          </StyledListItem>
        ))}
      </List>
    </StyledPaper>
  );
}

export default CropRecommendations;
