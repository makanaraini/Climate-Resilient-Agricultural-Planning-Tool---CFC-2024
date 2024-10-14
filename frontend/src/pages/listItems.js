import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom'; // Import Link for routing
import DashboardIcon from '@mui/icons-material/Dashboard';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard" aria-label="Dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/water-management" aria-label="Water Management">
      <ListItemIcon>
        <WaterDropIcon />
      </ListItemIcon>
      <ListItemText primary="Water Management" />
    </ListItemButton>
    <ListItemButton component={Link} to="/soil-analysis" aria-label="Soil Analysis">
      <ListItemIcon>
        <GrassIcon />
      </ListItemIcon>
      <ListItemText primary="Soil Analysis" />
    </ListItemButton>
    <ListItemButton component={Link} to="/weather-details" aria-label="Weather Details">
      <ListItemIcon>
        <WbSunnyIcon />
      </ListItemIcon>
      <ListItemText primary="Weather Details" />
    </ListItemButton>
    <ListItemButton component={Link} to="/reports" aria-label="Reports">
      <ListItemIcon>
        <AssessmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/user-profile" aria-label="User Profile">
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="User Profile" />
    </ListItemButton>
  </React.Fragment>
);
