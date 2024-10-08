import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component="a" href="#dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component="a" href="#water-management">
      <ListItemIcon>
        <WaterDropIcon />
      </ListItemIcon>
      <ListItemText primary="Water Management" />
    </ListItemButton>
    <ListItemButton component="a" href="#soil-analysis">
      <ListItemIcon>
        <GrassIcon />
      </ListItemIcon>
      <ListItemText primary="Soil Analysis" />
    </ListItemButton>
    <ListItemButton component="a" href="#weather-details">
      <ListItemIcon>
        <WbSunnyIcon />
      </ListItemIcon>
      <ListItemText primary="Weather Details" />
    </ListItemButton>
    <ListItemButton component="a" href="#reports">
      <ListItemIcon>
        <AssessmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton component="a" href="#user-profile">
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="User Profile" />
    </ListItemButton>
  </React.Fragment>
);
