import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import { Box, Typography, TextField, Button, Select, MenuItem, Paper, Grid } from '@mui/material';
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

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.light,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.dark,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
  transition: 'all 0.3s ease-in-out',
}));

const ChartBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const DataVisualization = ({ agriculturalData }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [chartType, setChartType] = useState('bar');

  const filterData = () => {
    return agriculturalData.filter(item => {
      const itemDate = new Date(item.date);
      return (!startDate || itemDate >= new Date(startDate)) &&
             (!endDate || itemDate <= new Date(endDate)) &&
             (selectedCrop === 'All' || item.crop === selectedCrop);
    });
  };

  const filteredData = filterData();

  const crops = ['All', ...new Set(agriculturalData.map(item => item.crop))];

  const barData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Yield',
        data: filteredData.map(item => item.yield),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Area',
        data: filteredData.map(item => item.area),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const scatterData = {
    datasets: crops.filter(crop => crop !== 'All').map((crop, index) => ({
      label: crop,
      data: filteredData.filter(item => item.crop === crop).map(item => ({
        x: item.area,
        y: item.yield,
      })),
      backgroundColor: `hsl(${index * 137.5}, 70%, 50%)`,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Agricultural Data',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
    },
  };

  const toggleChartType = () => {
    setChartType(chartType === 'bar' ? 'line' : 'bar');
  };

  return (
    <StyledPaper>
      <StyledTypography variant="h4">
        Agricultural Data Visualization
      </StyledTypography>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledTextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledTextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledSelect
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            fullWidth
          >
            {crops.map(crop => (
              <MenuItem key={crop} value={crop}>{crop}</MenuItem>
            ))}
          </StyledSelect>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledButton 
            variant="contained" 
            onClick={toggleChartType}
            fullWidth
          >
            Toggle Chart Type
          </StyledButton>
        </Grid>
      </Grid>
      <ChartBox>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: 'text.secondary' }}>
          {chartType === 'bar' ? 'Yield Over Time' : 'Area Over Time'}
        </Typography>
        {chartType === 'bar' ? (
          <Bar data={barData} options={options} />
        ) : (
          <Line data={lineData} options={options} />
        )}
      </ChartBox>
      <ChartBox>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: 'text.secondary' }}>
          Yield vs Area (Scatter Plot)
        </Typography>
        <Scatter 
          data={scatterData} 
          options={{
            ...options,
            scales: {
              x: { title: { display: true, text: 'Area' } },
              y: { title: { display: true, text: 'Yield' } },
            },
          }} 
        />
      </ChartBox>
    </StyledPaper>
  );
};

export default DataVisualization;
