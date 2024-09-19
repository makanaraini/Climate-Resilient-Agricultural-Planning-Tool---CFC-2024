import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';

function DataInputForm() {
  const [crop, setCrop] = useState('');
  const [yieldAmount, setYieldAmount] = useState('');
  const [temperature, setTemperature] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to submit data.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/agricultural-data', {
        crop,
        yield: yieldAmount,
        temperature,
        rainfall
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setMessage('Data submitted successfully.');
        setCrop('');
        setYieldAmount('');
        setTemperature('');
        setRainfall('');
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
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="yield"
          label="Yield"
          name="yield"
          type="number"
          value={yieldAmount}
          onChange={(e) => setYieldAmount(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="temperature"
          label="Temperature"
          name="temperature"
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="rainfall"
          label="Rainfall"
          name="rainfall"
          type="number"
          value={rainfall}
          onChange={(e) => setRainfall(e.target.value)}
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
