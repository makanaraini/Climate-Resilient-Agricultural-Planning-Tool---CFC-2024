import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Alert, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function DataInputForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    crop: '',
    yieldAmount: '',
    temperature: '',
    rainfall: '',
    plantingDate: '',
    harvestDate: '',
    area: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('You must be logged in to submit data.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/agricultural-data', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (response.status === 201) {
        setMessage('Data submitted successfully.');
        setFormData({
          crop: '',
          yieldAmount: '',
          temperature: '',
          rainfall: '',
          plantingDate: '',
          harvestDate: '',
          area: ''
        });
      }
    } catch (err) {
      setMessage('Error submitting data.');
    }
  };

  return (
    <Container component="main" maxWidth="sm" className="mt-8">
      <Paper elevation={3} className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <Typography component="h1" variant="h4" className="text-center text-green-800 font-bold mb-6">
          Submit Agricultural Data
        </Typography>
        {message && <Alert severity="info" className="mb-4">{message}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            variant="outlined"
            required
            fullWidth
            id="crop"
            label="Crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="yield"
            label="Yield (kg/hectare)"
            name="yieldAmount"
            type="number"
            value={formData.yieldAmount}
            onChange={handleChange}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="temperature"
            label="Temperature (°C)"
            name="temperature"
            type="number"
            value={formData.temperature}
            onChange={handleChange}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="rainfall"
            label="Rainfall (mm)"
            name="rainfall"
            type="number"
            value={formData.rainfall}
            onChange={handleChange}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="plantingDate"
            label="Planting Date"
            name="plantingDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.plantingDate}
            onChange={handleChange}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="harvestDate"
            label="Harvest Date"
            name="harvestDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.harvestDate}
            onChange={handleChange}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="area"
            label="Area (hectares)"
            name="area"
            type="number"
            value={formData.area}
            onChange={handleChange}
            className="bg-white"
          />
          <Box className="mt-6">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default DataInputForm;
