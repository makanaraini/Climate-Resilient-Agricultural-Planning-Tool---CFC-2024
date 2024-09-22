import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import { Box, Typography, TextField, Button, Select, MenuItem, Paper, Grid } from '@mui/material';
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
    <Paper elevation={3} className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
      <Typography variant="h4" className="text-center text-green-800 font-bold mb-6">
        Agricultural Data Visualization
      </Typography>
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            className="bg-white"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            className="bg-white"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            fullWidth
            className="bg-white"
          >
            {crops.map(crop => (
              <MenuItem key={crop} value={crop}>{crop}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={toggleChartType}
            fullWidth
            className="h-full bg-green-600 hover:bg-green-700 transition duration-300"
          >
            Toggle Chart Type
          </Button>
        </Grid>
      </Grid>
      <Box className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Typography variant="h6" className="mb-4 text-gray-700">
          {chartType === 'bar' ? 'Yield Over Time' : 'Area Over Time'}
        </Typography>
        {chartType === 'bar' ? (
          <Bar data={barData} options={options} />
        ) : (
          <Line data={lineData} options={options} />
        )}
      </Box>
      <Box className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Typography variant="h6" className="mb-4 text-gray-700">
          Yield vs Area (Scatter Plot)
        </Typography>
        <Scatter data={scatterData} options={{
          ...options,
          scales: {
            x: { title: { display: true, text: 'Area' } },
            y: { title: { display: true, text: 'Yield' } },
          },
        }} />
      </Box>
    </Paper>
  );
};

export default DataVisualization;
