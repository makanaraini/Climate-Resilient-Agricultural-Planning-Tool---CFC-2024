import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { WiThermometer, WiRaindrop, WiHumidity, WiStrongWind } from 'weather-icons-react';

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
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

function WeatherDetails({ data }) {
  const latestData = data[data.length - 1];

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
        Latest Weather Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeadCell>Date</StyledTableHeadCell>
              <StyledTableHeadCell>Max Temp (°C)</StyledTableHeadCell>
              <StyledTableHeadCell>Min Temp (°C)</StyledTableHeadCell>
              <StyledTableHeadCell>Precipitation (mm)</StyledTableHeadCell>
              <StyledTableHeadCell>Humidity (%)</StyledTableHeadCell>
              <StyledTableHeadCell>Wind Speed (km/h)</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>{new Date(latestData.date).toLocaleDateString()}</StyledTableCell>
              <StyledTableCell>
                <IconWrapper>
                  <WiThermometer size={32} />
                </IconWrapper>
                <Typography variant="body1">{latestData.temperature_max}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <IconWrapper>
                  <WiThermometer size={32} />
                </IconWrapper>
                <Typography variant="body1">{latestData.temperature_min}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <IconWrapper>
                  <WiRaindrop size={32} />
                </IconWrapper>
                <Typography variant="body1">{latestData.precipitation}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <IconWrapper>
                  <WiHumidity size={32} />
                </IconWrapper>
                <Typography variant="body1">{latestData.humidity}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <IconWrapper>
                  <WiStrongWind size={32} />
                </IconWrapper>
                <Typography variant="body1">{latestData.wind_speed}</Typography>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledPaper>
  );
}

export default WeatherDetails;