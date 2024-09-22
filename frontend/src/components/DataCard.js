import React from 'react';
import { Typography, Paper } from '@mui/material';

function DataCard({ title, value }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
}

export default DataCard;
