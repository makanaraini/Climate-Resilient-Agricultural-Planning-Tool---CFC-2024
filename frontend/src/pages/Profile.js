import React, { useState, useEffect, useCallback } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import { supabase } from '../utils/supabaseClient';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');

  const fetchFarmerProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching farmer profile:', error);
      } else if (data) {
        setName(data.name || '');
        setEmail(user.email || '');
        setFarmName(data.farm_name || '');
        setLocation(data.location || '');
      }
    }
  }, []);

  useEffect(() => {
    fetchFarmerProfile();
  }, [fetchFarmerProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('farmers')
        .upsert({ user_id: user.id, name, farm_name: farmName, location });

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        console.log('Profile updated successfully');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Farmer Profile</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          disabled
          margin="normal"
        />
        <TextField
          fullWidth
          label="Farm Name"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Profile
        </Button>
      </form>
    </Box>
  );
}

export default Profile;
