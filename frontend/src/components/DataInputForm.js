import React from 'react';
import { TextField, Button, Box, FormControlLabel, Checkbox, MenuItem, Typography } from '@mui/material';

function DataInputForm({ 
  location, setLocation, 
  soilType, setSoilType, 
  region, setRegion, 
  altitude, setAltitude, 
  farmSize, setFarmSize,
  waterAvailability, setWaterAvailability,
  season, setSeason,
  previousCrop, setPreviousCrop,
  farmingMethod, setFarmingMethod,
  equipment, setEquipment,
  marketDemand, setMarketDemand,
  handleSubmit 
}) {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, color: '#2e7d32', fontWeight: 'bold' }}>
        Farm Data Input Form
      </Typography>
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <TextField
        select
        label="Soil Type"
        value={soilType}
        onChange={(e) => setSoilType(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      >
        <MenuItem value="">Select...</MenuItem>
        <MenuItem value="clay">Clay</MenuItem>
        <MenuItem value="sandy">Sandy</MenuItem>
        <MenuItem value="loam">Loam</MenuItem>
      </TextField>
      <TextField
        select
        label="Region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      >
        <MenuItem value="">Select...</MenuItem>
        <MenuItem value="north">North</MenuItem>
        <MenuItem value="south">South</MenuItem>
        <MenuItem value="east">East</MenuItem>
        <MenuItem value="west">West</MenuItem>
      </TextField>
      <TextField
        select
        label="Altitude"
        value={altitude}
        onChange={(e) => setAltitude(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      >
        <MenuItem value="">Select...</MenuItem>
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </TextField>
      <TextField
        label="Farm Size (acres)"
        type="number"
        value={farmSize}
        onChange={(e) => setFarmSize(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <TextField
        select
        label="Water Availability"
        value={waterAvailability}
        onChange={(e) => setWaterAvailability(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      >
        <MenuItem value="">Select...</MenuItem>
        <MenuItem value="abundant">Abundant</MenuItem>
        <MenuItem value="limited">Limited</MenuItem>
        <MenuItem value="scarce">Scarce</MenuItem>
      </TextField>
      <TextField
        select
        label="Current Season"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      >
        <MenuItem value="">Select...</MenuItem>
        <MenuItem value="spring">Spring</MenuItem>
        <MenuItem value="summer">Summer</MenuItem>
        <MenuItem value="autumn">Autumn</MenuItem>
        <MenuItem value="winter">Winter</MenuItem>
      </TextField>
      <TextField
        label="Previous Crop"
        value={previousCrop}
        onChange={(e) => setPreviousCrop(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <FormControlLabel
        control={<Checkbox checked={farmingMethod === 'organic'} onChange={(e) => setFarmingMethod(e.target.checked ? 'organic' : null)} />}
        label="Organic Farming"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Available Equipment"
        value={equipment}
        onChange={(e) => setEquipment(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <TextField
        label="Market Demand"
        value={marketDemand}
        onChange={(e) => setMarketDemand(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ backgroundColor: '#2e7d32', color: '#ffffff' }}>
        Update Recommendations
      </Button>
    </Box>
  );
}

export default DataInputForm;
