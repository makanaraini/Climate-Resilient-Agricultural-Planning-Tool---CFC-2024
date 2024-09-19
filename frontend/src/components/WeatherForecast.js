import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const WeatherForecast = ({ forecast }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Temperature (°C)</TableCell>
            <TableCell>Humidity (%)</TableCell>
            <TableCell>Precipitation (mm)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forecast.map((day) => (
            <TableRow key={day.date}>
              <TableCell>{day.date}</TableCell>
              <TableCell>{day.temperature}</TableCell>
              <TableCell>{day.humidity}</TableCell>
              <TableCell>{day.precipitation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeatherForecast;
