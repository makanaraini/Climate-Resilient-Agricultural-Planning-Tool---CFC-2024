import React, { useState } from 'react';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

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
    <Box>
      <Typography variant="h6" gutterBottom>Agricultural Data Visualization</Typography>
      <Box mb={2}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          {crops.map(crop => (
            <MenuItem key={crop} value={crop}>{crop}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" onClick={toggleChartType}>
          Toggle Chart Type
        </Button>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">
          {chartType === 'bar' ? 'Yield Over Time' : 'Area Over Time'}
        </Typography>
        {chartType === 'bar' ? (
          <Bar data={barData} options={options} />
        ) : (
          <Line data={lineData} options={options} />
        )}
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Yield vs Area (Scatter Plot)</Typography>
        <Scatter data={scatterData} options={{
          ...options,
          scales: {
            x: { title: { display: true, text: 'Area' } },
            y: { title: { display: true, text: 'Yield' } },
          },
        }} />
      </Box>
    </Box>
  );
};

export default DataVisualization;
