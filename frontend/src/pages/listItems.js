import React from 'react';
import ListItemButton from '@mui/material/ListItemButton.js';
import ListItemIcon from '@mui/material/ListItemIcon.js';
import ListItemText from '@mui/material/ListItemText.js';
import DashboardIcon from '@mui/icons-material/Dashboard.js';
import WaterDropIcon from '@mui/icons-material/WaterDrop.js';
import GrassIcon from '@mui/icons-material/Grass.js';
import WbSunnyIcon from '@mui/icons-material/WbSunny.js';
import AssessmentIcon from '@mui/icons-material/Assessment.js';
import PersonIcon from '@mui/icons-material/Person.js';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <WaterDropIcon />
      </ListItemIcon>
      <ListItemText primary="Water Management" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <GrassIcon />
      </ListItemIcon>
      <ListItemText primary="Soil Analysis" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <WbSunnyIcon />
      </ListItemIcon>
      <ListItemText primary="Weather Details" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssessmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="User Profile" />
    </ListItemButton>
  </React.Fragment>
);
