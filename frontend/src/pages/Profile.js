import React, { useState, useEffect, useCallback } from 'react';
import { Typography, TextField, Button, Box, Avatar, IconButton, List, ListItem, ListItemText, Tooltip } from '@mui/material';
import { PhotoCamera, Edit } from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient';
import { styled } from '@mui/material/styles';

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: 'auto',
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  marginTop: theme.spacing(4),
  textAlign: 'center',
}));

const ProfileDetails = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ProfileText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 300,
}));

const ProfileTextBold = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
}));

const EditButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function Profile() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [farms, setFarms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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
        setAvatarUrl(data.avatar_url || '');
        setName(data.name || '');
        setUsername(data.username || '');
        setEmail(user.email || '');
        setFarmName(data.farm_name || '');
        setLocation(data.location || '');
        setFarms(data.farms || []);
      }
    }
  }, []);

  useEffect(() => {
    fetchFarmerProfile();
  }, [fetchFarmerProfile]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return;
    }

    const { publicURL, error: urlError } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return;
    }

    setAvatarUrl(publicURL);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('farmers')
        .upsert({ user_id: user.id, avatar_url: publicURL });

      if (error) {
        console.error('Error updating avatar URL:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('farmers')
        .upsert({ user_id: user.id, name, username, farm_name: farmName, location, farms });

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        console.log('Profile updated successfully');
        setIsEditing(false);
      }
    }
  };

  return (
    <ProfileContainer>
      <ProfileTextBold variant="h4" gutterBottom>Farmer Profile</ProfileTextBold>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexDirection: 'column' }}>
        <AvatarStyled src={avatarUrl} />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          onChange={handleAvatarChange}
        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
        <Tooltip title="Edit Profile" placement="right">
          <IconButton color="primary" aria-label="edit profile" onClick={() => setIsEditing(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
      </Box>
      {isEditing ? (
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
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <EditButton type="submit" variant="contained" color="primary">
            Update Profile
          </EditButton>
        </form>
      ) : (
        <ProfileDetails>
          <ProfileText variant="body1"><strong>Name:</strong> {name}</ProfileText>
          <ProfileText variant="body1"><strong>Username:</strong> {username}</ProfileText>
          <ProfileText variant="body1"><strong>Email:</strong> {email}</ProfileText>
          <ProfileText variant="body1"><strong>Farm Name:</strong> {farmName}</ProfileText>
          <ProfileText variant="body1"><strong>Location:</strong> {location}</ProfileText>
        </ProfileDetails>
      )}
      <ProfileTextBold variant="h6" gutterBottom sx={{ mt: 4 }}>Farms</ProfileTextBold>
      <List>
        {farms.map((farm, index) => (
          <ListItem key={index}>
            <ListItemText primary={farm.name} secondary={farm.location} />
          </ListItem>
        ))}
      </List>
    </ProfileContainer>
  );
}

export default Profile;
