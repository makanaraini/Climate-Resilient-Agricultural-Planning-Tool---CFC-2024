import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">User Profile</Typography>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            value={profile.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            label="Email"
            value={profile.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="location"
            label="Location"
            value={profile.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Preferred Units</InputLabel>
            <Select
              name="preferred_units"
              value={profile.preferred_units}
              onChange={handleChange}
            >
              <MenuItem value="metric">Metric</MenuItem>
              <MenuItem value="imperial">Imperial</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </form>
      ) : (
        <Box>
          <Typography>Name: {profile.name}</Typography>
          <Typography>Email: {profile.email}</Typography>
          <Typography>Location: {profile.location}</Typography>
          <Typography>Preferred Units: {profile.preferred_units}</Typography>
          <Button onClick={() => setIsEditing(true)} variant="contained" color="primary">
            Edit Profile
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
