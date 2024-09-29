import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CircularProgress } from '@mui/material/index.js';
import { styled } from '@mui/material/styles.js';
import { supabase } from '../utils/supabaseClient.js';

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
      const { data, error } = await supabase.from('soil_analysis').select('*').order('date', { ascending: true });

      if (error) throw error;
      setSoilData(data);
    } catch (error) {
      console.error('Error fetching soil data:', error);
      setError('Failed to fetch soil data');
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
              <TableCell>Date</TableCell>
              <TableCell>pH</TableCell>
              <TableCell>Nitrogen (N)</TableCell>
              <TableCell>Phosphorus (P)</TableCell>
              <TableCell>Potassium (K)</TableCell>
              <TableCell>Organic Matter (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {soilData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.ph}</TableCell>
                <TableCell>{row.nitrogen}</TableCell>
                <TableCell>{row.phosphorus}</TableCell>
                <TableCell>{row.potassium}</TableCell>
                <TableCell>{row.organic_matter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledPaper>
  );
}

export default SoilAnalysis;
