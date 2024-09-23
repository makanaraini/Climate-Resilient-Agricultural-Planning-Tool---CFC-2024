import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { supabase } from '../utils/supabaseClient';

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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Soil Analysis Data</Typography>
      <TableContainer component={Paper}>
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
      </TableContainer>
    </Paper>
  );
}

export default SoilAnalysis;
