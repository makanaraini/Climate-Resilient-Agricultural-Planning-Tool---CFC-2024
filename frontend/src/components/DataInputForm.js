import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Add this import

function DataInputForm() {
  const { user } = useAuth(); // Add this line
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
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Submit Agricultural Data
      </Typography>
      {message && <Alert severity="info">{message}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="crop"
          label="Crop"
          name="crop"
          value={formData.crop}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="yield"
          label="Yield (kg/hectare)"
          name="yieldAmount"
          type="number"
          value={formData.yieldAmount}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="temperature"
          label="Temperature (°C)"
          name="temperature"
          type="number"
          value={formData.temperature}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="rainfall"
          label="Rainfall (mm)"
          name="rainfall"
          type="number"
          value={formData.rainfall}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="plantingDate"
          label="Planting Date"
          name="plantingDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.plantingDate}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="harvestDate"
          label="Harvest Date"
          name="harvestDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.harvestDate}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="area"
          label="Area (hectares)"
          name="area"
          type="number"
          value={formData.area}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default DataInputForm;
