import React from 'react.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material.js';
import { styled } from '@mui/system.js';
import { WbSunny, Cloud, Opacity, Thermostat } from '@mui/icons-material.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginTop: theme.spacing(2),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const WeatherForecast = ({ forecast }) => {
  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
        Weather Forecast
      </Typography>
      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeadCell>Date</StyledTableHeadCell>
              <StyledTableHeadCell>
                <IconWrapper>
                  <Thermostat />
                </IconWrapper>
                Temperature (°C)
              </StyledTableHeadCell>
              <StyledTableHeadCell>
                <IconWrapper>
                  <Opacity />
                </IconWrapper>
                Humidity (%)
              </StyledTableHeadCell>
              <StyledTableHeadCell>
                <IconWrapper>
                  <Cloud />
                </IconWrapper>
                Precipitation (mm)
              </StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {forecast.map((day, index) => (
              <StyledTableRow key={day.date}>
                <StyledTableCell>{day.date}</StyledTableCell>
                <StyledTableCell>{day.temperature}</StyledTableCell>
                <StyledTableCell>{day.humidity}</StyledTableCell>
                <StyledTableCell>{day.precipitation}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledPaper>
  );
};

export default WeatherForecast;
