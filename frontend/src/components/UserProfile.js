import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Paper, Grid } from '@mui/material/index';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material/index';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    preferred_units: 'metric'
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Paper elevation={3} className="p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg">
      <Typography variant="h4" className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <EditIcon className="mr-2 text-green-600" />
        User Profile
      </Typography>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            name="name"
            label="Name"
            value={profile.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-white"
          />
          <TextField
            name="email"
            label="Email"
            value={profile.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-white"
          />
          <TextField
            name="location"
            label="Location"
            value={profile.location}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-white"
          />
          <FormControl fullWidth variant="outlined" className="bg-white">
            <InputLabel>Preferred Units</InputLabel>
            <Select
              name="preferred_units"
              value={profile.preferred_units}
              onChange={handleChange}
              label="Preferred Units"
            >
              <MenuItem value="metric">Metric</MenuItem>
              <MenuItem value="imperial">Imperial</MenuItem>
            </Select>
          </FormControl>
          <Box className="flex justify-end space-x-4 mt-6">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outlined"
              startIcon={<CancelIcon />}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Cancel
            </Button>
          </Box>
        </form>
      ) : (
        <Grid container spacing={3} className="bg-white p-6 rounded-lg shadow-md">
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" className="text-gray-600 font-semibold">Name</Typography>
            <Typography variant="body1" className="text-gray-800">{profile.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" className="text-gray-600 font-semibold">Email</Typography>
            <Typography variant="body1" className="text-gray-800">{profile.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" className="text-gray-600 font-semibold">Location</Typography>
            <Typography variant="body1" className="text-gray-800">{profile.location}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" className="text-gray-600 font-semibold">Preferred Units</Typography>
            <Typography variant="body1" className="text-gray-800 capitalize">{profile.preferred_units}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => setIsEditing(true)}
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default UserProfile;
