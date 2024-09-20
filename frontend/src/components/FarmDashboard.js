import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, Box, Grid, Paper, Button, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FarmDashboard = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [cropData, setCropData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!user) {
      setError('You must be logged in to view this dashboard.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/farm-dashboard', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setKpis(response.data.kpis);
      setCropData(response.data.cropData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Crop,Yield (kg/ha),Area (ha)\n"
      + cropData.map(row => `${row.crop},${row.yield},${row.area}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farm_data.csv");
    document.body.appendChild(link);
    link.click();
  };

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
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Crop Yield Comparison',
      },
    },
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Farm Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Total Yield</Typography>
            <Typography variant="h4">{kpis?.totalYield} kg</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Total Area</Typography>
            <Typography variant="h4">{kpis?.totalArea} ha</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Average Yield</Typography>
            <Typography variant="h4">{kpis?.averageYield} kg/ha</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Bar data={chartData} options={chartOptions} />
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Crop</TableCell>
              <TableCell align="right">Yield (kg/ha)</TableCell>
              <TableCell align="right">Area (ha)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cropData.map((row) => (
              <TableRow key={row.crop}>
                <TableCell component="th" scope="row">{row.crop}</TableCell>
                <TableCell align="right">{row.yield}</TableCell>
                <TableCell align="right">{row.area}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={exportCSV}>
        Export CSV
      </Button>
    </Box>
  );
};

export default FarmDashboard;
