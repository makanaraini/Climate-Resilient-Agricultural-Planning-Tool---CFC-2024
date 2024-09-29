import React, { useState } from 'react.js';
import axios from 'axios.js';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, Alert, Paper } from '@mui/material.js';
import { styled } from '@mui/material/styles.js';
import { useAuth } from '../contexts/AuthContext.js';
import BugReportIcon from '@mui/icons-material/BugReport.js';
import ErrorIcon from '@mui/icons-material/Error.js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3, 0),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledList = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PestDiseasePrediction = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    crop: '',
    temperature: '',
    humidity: ''
  });
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to use this feature.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/pest-disease-prediction', 
        { 
          crop: formData.crop, 
          temperature: parseFloat(formData.temperature), 
          humidity: parseFloat(formData.humidity)
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching pest/disease predictions:', error);
      setError('Failed to fetch predictions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
          <BugReportIcon sx={{ fontSize: 40, mr: 2 }} />
          Pest and Disease Prediction
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <StyledForm onSubmit={handleSubmit}>
          <StyledTextField
            label="Crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <StyledTextField
            label="Temperature (°C)"
            name="temperature"
            type="number"
            value={formData.temperature}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <StyledTextField
            label="Humidity (%)"
            name="humidity"
            type="number"
            value={formData.humidity}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <StyledButton 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Predicting...' : 'Predict Risks'}
          </StyledButton>
        </StyledForm>
        {predictions.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
              Potential Risks:
            </Typography>
            <StyledList>
              {predictions.map((prediction, index) => (
                <StyledListItem key={index}>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                        {prediction.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {prediction.risk_level === 1 ? (
                          <ErrorIcon sx={{ color: 'error.main', mr: 1 }} />
                        ) : (
                          <CheckCircleIcon sx={{ color: 'warning.main', mr: 1 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: prediction.risk_level === 1 ? 'error.main' : 'warning.main' }}>
                          Risk Level: {prediction.risk_level === 1 ? 'High' : 'Medium'}
                        </Typography>
                      </Box>
                    }
                  />
                </StyledListItem>
              ))}
            </StyledList>
          </Box>
        )}
        {predictions.length === 0 && !isLoading && (
          <Typography sx={{ mt: 3, textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
            No significant risks predicted.
          </Typography>
        )}
      </StyledPaper>
    </Box>
  );
};

export default PestDiseasePrediction;
