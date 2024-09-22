import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField, Button, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [farmSize, setFarmSize] = useState('');
  const [resources, setResources] = useState('');
  const [practices, setPractices] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmerProfile();
  }, [user]);

  async function fetchFarmerProfile() {
    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFarmSize(data.farm_size || '');
        setResources(data.resources_available || '');
        setPractices(data.farming_practices || '');
      }
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const updates = {
        data: { name },
      };

      const { error: updateError } = await updateProfile(updates);
      if (updateError) throw updateError;

      const { error: farmerProfileError } = await supabase
        .from('farmer_profiles')
        .upsert({ 
          user_id: user.id, 
          farm_size: parseFloat(farmSize), 
          resources_available: resources, 
          farming_practices: practices 
        });

      if (farmerProfileError) throw farmerProfileError;

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farmer Profile
      </Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Farm Size (hectares)"
                type="number"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Available Resources"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Farming Practices"
                value={practices}
                onChange={(e) => setPractices(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
