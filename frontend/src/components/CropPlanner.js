import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box } from '@mui/material/index.js';
import { styled } from '@mui/material/styles.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  backgroundColor: theme.palette.background.default,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function CropPlanner({ onAddCrop }) {
  const [newCrop, setNewCrop] = useState({
    crop_type: '',
    growth_cycle: '',
    water_requirements: '',
    nutrient_requirements: '',
  });

  const handleInputChange = (e) => {
    setNewCrop({ ...newCrop, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCrop(newCrop);
    setNewCrop({
      crop_type: '',
      growth_cycle: '',
      water_requirements: '',
      nutrient_requirements: '',
    });
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" gutterBottom>
        Add New Crop
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Crop Type"
              name="crop_type"
              value={newCrop.crop_type}
              onChange={handleInputChange}
              required="true"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Growth Cycle (days)"
              name="growth_cycle"
              type="number"
              value={newCrop.growth_cycle}
              onChange={handleInputChange}
              required="true"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Water Requirements (L)"
              name="water_requirements"
              type="number"
              value={newCrop.water_requirements}
              onChange={handleInputChange}
              required="true"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nutrient Requirements"
              name="nutrient_requirements"
              value={newCrop.nutrient_requirements}
              onChange={handleInputChange}
              required="true"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <StyledButton type="submit" variant="contained" color="primary" size="large">
                Add Crop
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  );
}

export default CropPlanner;