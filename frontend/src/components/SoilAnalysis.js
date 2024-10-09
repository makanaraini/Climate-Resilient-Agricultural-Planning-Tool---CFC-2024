import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CircularProgress } from '@mui/material/index';
import { styled } from '@mui/material/styles';
import { supabase } from '../utils/supabaseClient'; // Adjust the path if necessary

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function SoilAnalysis() {
  const [soilData, setSoilData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSoilData();
  }, []);

  async function fetchSoilData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('soil_data')
        .select('location, soil_type, soil_ph, nutrient_content, soil_moisture, soil_temperature')
        .order('location', { ascending: true });

      if (error) throw error;
      
      // Get unique soil data entries
      const uniqueSoilData = data.filter((v, i, a) => a.findIndex(t => (t.location === v.location)) === i);
      setSoilData(uniqueSoilData);
    } catch (error) {
      console.error('Error fetching soil data:', error);
      setError('Failed to fetch soil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Typography color="error" align="center" variant="h6">
      {error}
    </Typography>
  );

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom color="primary">
        Soil Analysis Data
      </Typography>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Soil Type</TableCell>
              <TableCell>Soil pH</TableCell>
              <TableCell>Nutrient Content</TableCell>
              <TableCell>Soil Moisture</TableCell>
              <TableCell>Soil Temperature</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {soilData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.soil_type}</TableCell>
                <TableCell>{row.soil_ph}</TableCell>
                <TableCell>{row.nutrient_content}</TableCell>
                <TableCell>{row.soil_moisture}</TableCell>
                <TableCell>{row.soil_temperature}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledPaper>
  );
}

export default SoilAnalysis;
