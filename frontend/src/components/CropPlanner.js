import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

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
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Crop Type"
            name="crop_type"
            value={newCrop.crop_type}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Growth Cycle (days)"
            name="growth_cycle"
            type="number"
            value={newCrop.growth_cycle}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Water Requirements (L)"
            name="water_requirements"
            type="number"
            value={newCrop.water_requirements}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nutrient Requirements"
            name="nutrient_requirements"
            value={newCrop.nutrient_requirements}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Crop
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default CropPlanner;