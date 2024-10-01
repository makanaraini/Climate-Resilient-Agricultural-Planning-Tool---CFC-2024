import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box className="flex items-center justify-center h-full">
          <Paper elevation={3} className="p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-lg">
            <Box className="flex flex-col items-center space-y-4">
              <ErrorOutlineIcon className="text-red-500" style={{ fontSize: 60 }} />
              <Typography variant="h5" className="text-red-700 font-bold text-center">
                Oops! Something went wrong with the chart.
              </Typography>
              <Typography variant="body1" className="text-gray-600 text-center">
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </Typography>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
