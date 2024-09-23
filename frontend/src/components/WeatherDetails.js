import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function WeatherDetails({ data }) {
  const latestData = data[data.length - 1];

  return (
    <>
      <Typography variant="h6" gutterBottom>Latest Weather Details</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Max Temp (°C)</TableCell>
              <TableCell>Min Temp (°C)</TableCell>
              <TableCell>Precipitation (mm)</TableCell>
              <TableCell>Humidity (%)</TableCell>
              <TableCell>Wind Speed (km/h)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{new Date(latestData.date).toLocaleDateString()}</TableCell>
              <TableCell>{latestData.temperature_max}</TableCell>
              <TableCell>{latestData.temperature_min}</TableCell>
              <TableCell>{latestData.precipitation}</TableCell>
              <TableCell>{latestData.humidity}</TableCell>
              <TableCell>{latestData.wind_speed}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default WeatherDetails;