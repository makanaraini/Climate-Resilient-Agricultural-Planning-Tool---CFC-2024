import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { WbSunny, Cloud, Opacity, Thermostat } from '@mui/icons-material';

const WeatherForecast = ({ forecast }) => {
  return (
    <Paper elevation={3} className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg">
      <Typography variant="h4" className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <WbSunny className="mr-2 text-yellow-500" />
        Weather Forecast
      </Typography>
      <TableContainer className="overflow-hidden rounded-lg">
        <Table className="min-w-full">
          <TableHead>
            <TableRow className="bg-blue-100">
              <TableCell className="font-semibold text-gray-700">Date</TableCell>
              <TableCell className="font-semibold text-gray-700">
                <div className="flex items-center">
                  <Thermostat className="mr-1 text-red-500" />
                  Temperature (°C)
                </div>
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                <div className="flex items-center">
                  <Opacity className="mr-1 text-blue-500" />
                  Humidity (%)
                </div>
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                <div className="flex items-center">
                  <Cloud className="mr-1 text-gray-500" />
                  Precipitation (mm)
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forecast.map((day, index) => (
              <TableRow key={day.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="text-gray-800">{day.date}</TableCell>
                <TableCell className="text-gray-800">{day.temperature}</TableCell>
                <TableCell className="text-gray-800">{day.humidity}</TableCell>
                <TableCell className="text-gray-800">{day.precipitation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default WeatherForecast;
