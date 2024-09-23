import React from 'react';
import { TextField, Button, Box, FormControlLabel, Checkbox } from '@mui/material';

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
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <TextField
        select
        label="Soil Type"
        value={soilType}
        onChange={(e) => setSoilType(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
        SelectProps={{
          native: true,
        }}
      >
        <option value="">Select...</option>
        <option value="clay">Clay</option>
        <option value="sandy">Sandy</option>
        <option value="loam">Loam</option>
      </TextField>
      <TextField
        select
        label="Region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
        SelectProps={{
          native: true,
        }}
      >
        <option value="">Select...</option>
        <option value="north">North</option>
        <option value="south">South</option>
        <option value="east">East</option>
        <option value="west">West</option>
      </TextField>
      <TextField
        select
        label="Altitude"
        value={altitude}
        onChange={(e) => setAltitude(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
        SelectProps={{
          native: true,
        }}
      >
        <option value="">Select...</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </TextField>
      <TextField
        label="Farm Size (acres)"
        type="number"
        value={farmSize}
        onChange={(e) => setFarmSize(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <TextField
        select
        label="Water Availability"
        value={waterAvailability}
        onChange={(e) => setWaterAvailability(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
        SelectProps={{
          native: true,
        }}
      >
        <option value="">Select...</option>
        <option value="abundant">Abundant</option>
        <option value="limited">Limited</option>
        <option value="scarce">Scarce</option>
      </TextField>
      <TextField
        select
        label="Current Season"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
        SelectProps={{
          native: true,
        }}
      >
        <option value="">Select...</option>
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
        <option value="autumn">Autumn</option>
        <option value="winter">Winter</option>
      </TextField>
      <TextField
        label="Previous Crop"
        value={previousCrop}
        onChange={(e) => setPreviousCrop(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <FormControlLabel
        control={<Checkbox checked={farmingMethod === 'organic'} onChange={(e) => setFarmingMethod(e.target.checked ? 'organic' : null)} />}
        label="Organic Farming"
      />
      <TextField
        label="Available Equipment"
        value={equipment}
        onChange={(e) => setEquipment(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <TextField
        label="Market Demand"
        value={marketDemand}
        onChange={(e) => setMarketDemand(e.target.value)}
        sx={{ mr: 2, mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ backgroundColor: '#2e7d32', color: '#ffffff' }}>
        Update Recommendations
      </Button>
    </Box>
  );
}

export default DataInputForm;
