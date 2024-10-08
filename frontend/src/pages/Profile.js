import React, { useState, useEffect, useCallback } from 'react';
import { Typography, TextField, Button, Box, Avatar, IconButton, List, ListItem, ListItemText, Tooltip, Paper, Grid } from '@mui/material';
import { PhotoCamera, Edit, LocationOn, Person, Email, Business } from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient'; // Adjust the path if necessary
import { styled } from '@mui/material/styles';
import SatelliteTwoToneIcon from '@mui/icons-material/SatelliteTwoTone';

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  margin: 'auto',
  border: `4px solid ${theme.palette.background.paper}`,
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const ProfileDetails = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ProfileText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 300,
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const ProfileTextBold = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

const EditButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 20,
  padding: '8px 24px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FarmsList = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const FarmListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }
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

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return;
    }

    const { data: publicUrlData, error: urlError } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return;
    }

    const publicURL = publicUrlData.publicUrl;
    setAvatarUrl(publicURL);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }
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
      <ProfilePaper elevation={3}>
        <ProfileTextBold variant="h4" gutterBottom align="center">Farmer Profile</ProfileTextBold>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: 'column' }}>
          <AvatarStyled src={avatarUrl} />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
            onChange={handleAvatarChange}
          />
          <Box sx={{ mt: 2 }}>
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
        </Box>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  value={email}
                  disabled
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Farm Name"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <EditButton type="submit" variant="contained" color="primary">
                Update Profile
              </EditButton>
            </Box>
          </form>
        ) : (
          <ProfileDetails>
            <ProfileText variant="body1"><Person sx={{ mr: 1 }} /> <strong>Name:</strong> {name}</ProfileText>
            <ProfileText variant="body1"><Person sx={{ mr: 1 }} /> <strong>Username:</strong> {username}</ProfileText>
            <ProfileText variant="body1"><Email sx={{ mr: 1 }} /> <strong>Email:</strong> {email}</ProfileText>
            <ProfileText variant="body1"><Business sx={{ mr: 1 }} /> <strong>Farm Name:</strong> {farmName}</ProfileText>
            <ProfileText variant="body1"><LocationOn sx={{ mr: 1 }} /> <strong>Location:</strong> {location}</ProfileText>
          </ProfileDetails>
        )}
        <Box sx={{ mt: 4 }}>
          <ProfileTextBold variant="h6" gutterBottom>Farms</ProfileTextBold>
          <FarmsList>
            {farms.map((farm, index) => (
              <FarmListItem key={index}>
                <ListItemText 
                  primary={<Typography variant="subtitle1"><SatelliteTwoToneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />{farm.name}</Typography>}
                  secondary={<Typography variant="body2" color="textSecondary"><LocationOn sx={{ mr: 1, fontSize: 'small', verticalAlign: 'middle' }} />{farm.location}</Typography>}
                />
              </FarmListItem>
            ))}
          </FarmsList>
        </Box>
      </ProfilePaper>
    </ProfileContainer>
  );
}

export default Profile;
