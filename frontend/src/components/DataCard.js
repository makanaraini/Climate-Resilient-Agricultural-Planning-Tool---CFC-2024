import React from 'react';
import { Card, CardContent, Typography, styled } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function DataCard({ title, children }) {
  return (
    <StyledCard variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {children}
      </CardContent>
    </StyledCard>
  );
}

export default DataCard;
