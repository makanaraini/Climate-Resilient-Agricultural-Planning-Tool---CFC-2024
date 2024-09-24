import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { WaterDrop, Grass, Straighten, CalendarToday, Cloud } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #e6f7ff 0%, #e6ffed 100%)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
  },
}));

const ResultBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
}));

const WaterManagement = () => {
  const { user } = useAuth();
  
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');
  const [days, setDays] = useState('');
  const [expectedRainfall, setExpectedRainfall] = useState('');
  const [waterPlan, setWaterPlan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crop || area <= 0 || days <= 0 || expectedRainfall < 0) {
      setError('Please fill all fields with valid values.');
      return;
    }
    if (!user) {
      setError('You must be logged in to use this feature.');
      return;
    }
    setIsLoading(true);
    try {
      const token = user.token;
      const response = await axios.post('http://localhost:5000/api/water-management', 
        { 
          crop, 
          area: parseFloat(area), 
          days: parseInt(days), 
          expected_rainfall: parseFloat(expectedRainfall) 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWaterPlan(response.data);
    } catch (error) {
      console.error('Error fetching water management plan:', error);
      setError('Failed to fetch water management plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 'bold' }}>
        <WaterDrop sx={{ mr: 1 }} />
        Water Management Plan
      </Typography>
      {error && <Typography color="error" sx={{ mb: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              label="Crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <Grass sx={{ mr: 1, color: 'success.main' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              label="Area (hectares)"
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <Straighten sx={{ mr: 1, color: 'warning.main' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              label="Number of Days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <CalendarToday sx={{ mr: 1, color: 'secondary.main' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              label="Expected Rainfall (mm)"
              type="number"
              value={expectedRainfall}
              onChange={(e) => setExpectedRainfall(e.target.value)}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <Cloud sx={{ mr: 1, color: 'info.main' }} />,
              }}
            />
          </Grid>
        </Grid>
        <StyledButton 
          type="submit" 
          variant="contained" 
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? <CircularProgress size={24} /> : 'Calculate Water Needs'}
        </StyledButton>
      </form>
      {waterPlan && (
        <ResultBox>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>Water Management Plan Results:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Total Water Need:</strong> {waterPlan.total_water_need} liters</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Expected Rainfall:</strong> {waterPlan.expected_rainfall} liters</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Irrigation Need:</strong> {waterPlan.irrigation_need} liters</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Daily Irrigation:</strong> {waterPlan.daily_irrigation} liters</Typography>
            </Grid>
          </Grid>
        </ResultBox>
      )}
    </StyledPaper>
  );
};

export default WaterManagement;
