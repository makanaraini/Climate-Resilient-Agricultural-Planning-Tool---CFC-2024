import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, CircularProgress, Tooltip } from '@mui/material/index';
import { useTheme } from '@mui/material/styles';

function DataCard({ title, value, isLoading, error, icon: Icon, tooltip, customStyles }) {
  const theme = useTheme();

  return (
    <Tooltip title={tooltip || ''}>
      <Paper 
        sx={{ 
          p: 3,
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[3],
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[6],
          },
          ...customStyles 
        }}
      >
        {isLoading ? (
          <CircularProgress size={40} thickness={4} />
        ) : error ? (
          <Typography variant="body1" color="error" align="center">{error}</Typography>
        ) : (
          <>
            {Icon && <Icon sx={{ fontSize: 48, mb: 2, color: theme.palette.primary.main }} />}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>{value}</Typography>
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
