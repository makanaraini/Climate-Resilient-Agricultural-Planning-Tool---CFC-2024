import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function WeatherDetails({ data }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Weather Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Temperature (°C)</TableCell>
              <TableCell>Humidity (%)</TableCell>
              <TableCell>Precipitation (mm)</TableCell>
              <TableCell>Wind Speed (km/h)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.temperature_max}</TableCell>
                <TableCell>{row.humidity}</TableCell>
                <TableCell>{row.precipitation}</TableCell>
                <TableCell>{row.wind_speed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default WeatherDetails;