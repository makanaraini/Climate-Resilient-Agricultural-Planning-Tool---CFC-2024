import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid, Snackbar, Alert } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import CropPlanner from '../components/CropPlanner';
import DataTable from '../components/DataTable';

function Planning() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  async function fetchCrops() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('crop_type', { ascending: true });

      if (error) throw error;
      setCrops(data);
    } catch (error) {
      setError('Failed to fetch crops: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddCrop = async (newCrop) => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .insert([newCrop]);

      if (error) throw error;
      setSuccess(true);
      fetchCrops();
    } catch (error) {
      setError('Failed to add crop: ' + error.message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Crop Planning
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <CropPlanner onAddCrop={handleAddCrop} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <DataTable 
              data={crops}
              columns={[
                { field: 'crop_type', headerName: 'Crop Type', width: 150 },
                { field: 'growth_cycle', headerName: 'Growth Cycle', width: 150 },
                { field: 'water_requirements', headerName: 'Water Req. (L)', width: 150 },
                { field: 'nutrient_requirements', headerName: 'Nutrient Req.', width: 150 },
              ]}
            />
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Crop added successfully!
        </Alert>
      </Snackbar>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default Planning;
