import React from 'react';
import { Typography, Box } from '@mui/material';

function Home() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Climate-Resilient Agricultural Planning
      </Typography>
      <Typography variant="body1">
        This is the home page of our application. Here you can add an introduction or overview of the app's features.
      </Typography>
    </Box>
  );
}

export default Home;
