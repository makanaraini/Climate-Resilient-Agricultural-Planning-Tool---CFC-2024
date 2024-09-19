import React from 'react';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';

const DataExport = () => {
  const handleExport = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/export-data', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for file download
      });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'agricultural_data.csv';
      link.click();
      
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Export Data</Typography>
      <Button onClick={handleExport} variant="contained" color="primary">
        Download CSV
      </Button>
    </Box>
  );
};

export default DataExport;
