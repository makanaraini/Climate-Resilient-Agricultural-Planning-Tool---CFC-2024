import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, Box, Grid, Paper, Button, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { CloudDownload as CloudDownloadIcon } from '@mui/icons-material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FarmDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [cropData, setCropData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/farm-dashboard', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setKpis(response.data.kpis);
        setCropData(response.data.cropData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response) {
          setError(`Server error: ${error.response.status} ${error.response.data.message || ''}`);
        } else if (error.request) {
          setError('No response received from server. Please check your connection.');
        } else {
          setError('Error setting up the request. Please try again.');
        }
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
      setError('Please log in to view dashboard data.');
    }
  }, [isAuthenticated]);

  if (isLoading) return (
    <Box className="flex justify-center items-center h-screen">
      <CircularProgress className="text-green-500" />
    </Box>
  );
  
  if (error) return (
    <Typography color="error" className="text-center mt-8 text-xl font-semibold">
      {error}
    </Typography>
  );

  const chartData = {
    labels: cropData.map(crop => crop.crop),
    datasets: [
      {
        label: 'Yield (kg/ha)',
        data: cropData.map(crop => crop.yield),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Crop Yield Comparison' },
    },
  };

  const exportCSV = () => {
    // Implement CSV export logic here
    console.log('Exporting CSV...');
  };

  return (
    <Box className="p-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <Typography variant="h4" className="mb-6 text-green-800 font-bold">Farm Dashboard</Typography>
      
      <Grid container spacing={3} className="mb-8">
        {kpis && (
          <>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Typography variant="h6" className="text-gray-600 mb-2">Total Yield</Typography>
                <Typography variant="h4" className="text-green-600 font-bold">{kpis.totalYield} kg</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Typography variant="h6" className="text-gray-600 mb-2">Total Area</Typography>
                <Typography variant="h4" className="text-blue-600 font-bold">{kpis.totalArea} ha</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Typography variant="h6" className="text-gray-600 mb-2">Average Yield</Typography>
                <Typography variant="h4" className="text-yellow-600 font-bold">{kpis.averageYield} kg/ha</Typography>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>

      <Paper elevation={3} className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <Typography variant="h5" className="mb-4 text-gray-700">Crop Yield Comparison</Typography>
        <Bar data={chartData} options={chartOptions} />
      </Paper>

      <Paper elevation={3} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-green-100">
                <TableCell className="font-semibold text-green-800">Crop</TableCell>
                <TableCell align="right" className="font-semibold text-green-800">Yield (kg/ha)</TableCell>
                <TableCell align="right" className="font-semibold text-green-800">Area (ha)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cropData.map((row) => (
                <TableRow key={row.crop} className="hover:bg-gray-50">
                  <TableCell component="th" scope="row" className="font-medium text-gray-900">{row.crop}</TableCell>
                  <TableCell align="right" className="text-gray-700">{row.yield}</TableCell>
                  <TableCell align="right" className="text-gray-700">{row.area}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={exportCSV}
        startIcon={<CloudDownloadIcon />}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Export CSV
      </Button>
    </Box>
  );
};

export default FarmDashboard;
