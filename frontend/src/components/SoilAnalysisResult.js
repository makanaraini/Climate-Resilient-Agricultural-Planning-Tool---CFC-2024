import React from 'react.js';
import { Typography, Paper, Box } from '@mui/material/styles.js';

function SoilAnalysisResult({ result }) {
  return (
    <Paper elevation={3}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Soil Analysis Result
        </Typography>
        <Typography variant="body1">
          {result}
        </Typography>
      </Box>
    </Paper>
  );
}

export default SoilAnalysisResult;