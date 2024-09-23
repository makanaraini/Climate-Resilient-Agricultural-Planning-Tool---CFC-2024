import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, CircularProgress, Tooltip } from '@mui/material';

function DataCard({ title, value, isLoading, error, icon: Icon, tooltip, customStyles }) {
  return (
    <Tooltip title={tooltip || ''}>
      <Paper 
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          backgroundColor: '#f5f5dc', // beige color
          borderRadius: 2, 
          transition: 'background-color 0.3s, transform 0.3s',
          '&:hover': {
            backgroundColor: '#e0e0d1', // lighter beige color on hover
            transform: 'scale(1.05)',
          },
          ...customStyles 
        }}
        elevation={3}
      >
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="h6" color="error">{error}</Typography>
        ) : (
          <>
            {Icon && <Icon sx={{ fontSize: 40, mb: 1, color: 'green' }} />} {/* green color for icon */}
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography variant="h4" sx={{ color: 'green' }}>{value}</Typography> {/* green color for value */}
          </>
        )}
      </Paper>
    </Tooltip>
  );
}

DataCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  icon: PropTypes.elementType,
  tooltip: PropTypes.string,
  customStyles: PropTypes.object,
};

DataCard.defaultProps = {
  title: 'Default Title',
  value: 'N/A',
  isLoading: false,
  error: null,
  icon: null,
  tooltip: '',
  customStyles: {},
};

export default DataCard;
