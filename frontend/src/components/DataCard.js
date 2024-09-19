import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function DataCard({ title, children }) {
  return (
    <Card variant="outlined" style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export default DataCard;
