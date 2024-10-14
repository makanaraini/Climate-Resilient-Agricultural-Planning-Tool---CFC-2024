import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js/auto';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import { Box, Typography, TextField, Button, MenuItem, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: `linear-gradient(to bottom right, ${theme.palette.success.light}, ${theme.palette.primary.light})`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const DataVisualization = ({ agriculturalData }) => {
  const [cropType, setCropType] = useState('');
  const [filteredData, setFilteredData] = useState(agriculturalData);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCropTypeChange = (event) => {
    const selectedCrop = event.target.value;
    setCropType(selectedCrop);
    filterData(selectedCrop, startDate, endDate);
  };

  const handleDateChange = () => {
    filterData(cropType, startDate, endDate);
  };

  const filterData = (cropType, startDate, endDate) => {
    const filtered = agriculturalData.filter((data) => {
      const date = new Date(data.date);
      const isWithinCrop = cropType ? data.crop_type === cropType : true;
      const isWithinDateRange = (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
      return isWithinCrop && isWithinDateRange;
    });
    setFilteredData(filtered);
  };

  const cropTypes = [...new Set(agriculturalData.map(item => item.crop_type))];

  const dataLine = {
    labels: filteredData.map((data) => data.date),
    datasets: [
      {
        label: 'Yield',
        data: filteredData.map((data) => data.yield),
        borderColor: '#42a5f5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
      },
    ],
  };

  const dataBar = {
    labels: filteredData.map((data) => data.crop_type),
    datasets: [
      {
        label: 'Yield',
        data: filteredData.map((data) => data.yield),
        backgroundColor: '#66bb6a',
      },
    ],
  };

  const dataScatter = {
    datasets: [
      {
        label: 'Yield vs Soil Nutrient Level',
        data: filteredData.map((data) => ({ x: data.soil_nutrient_level, y: data.yield })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <StyledPaper>
        <StyledTypography variant="h4">Data Visualization</StyledTypography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <StyledTextField
              select
              label="Select Crop Type"
              value={cropType}
              onChange={handleCropTypeChange}
              fullWidth
            >
              {cropTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </StyledTextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledTextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledTextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleDateChange} sx={{ mt: 2, backgroundColor: '#1976d2', color: '#ffffff' }}>
          Filter Data
        </Button>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Yield Line Chart</Typography>
          <Line data={dataLine} />
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Yield Bar Chart</Typography>
          <Bar data={dataBar} />
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Yield vs Soil Nutrient Level (Scatter)</Typography>
          <Scatter data={dataScatter} />
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default DataVisualization;
