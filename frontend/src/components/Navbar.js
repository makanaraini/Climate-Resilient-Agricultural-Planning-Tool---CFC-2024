import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Tooltip, Divider, Box } from '@mui/material';
import { Home, Dashboard, Assessment, EventNote, Terrain, Person, ExitToApp, LockOpen, PersonAdd, Menu, Input, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/system';
import mpanziLogo from '../assets/mpanzi-logo.png'; // Import the Mpanzi logo

const HoverDrawer = styled(Drawer)(({ theme }) => ({
  width: 60,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '&:hover': {
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  '& .MuiDrawer-paper': {
    width: 60,
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Changed from 'flex-start' to 'space-between'
    '&:hover': {
      width: 240,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
}));

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <HoverDrawer variant="permanent">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <img src={mpanziLogo} alt="Mpanzi Logo" style={{ height: '40px' }} />
        </Box>
        <List>
          <Tooltip title="Home" placement="right">
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Dashboard" placement="right">
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Reports" placement="right">
            <ListItem button component={Link} to="/reports">
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Planning" placement="right">
            <ListItem button component={Link} to="/planning">
              <ListItemIcon>
                <EventNote />
              </ListItemIcon>
              <ListItemText primary="Planning" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Soil Analysis" placement="right">
            <ListItem button component={Link} to="/soil-analysis">
              <ListItemIcon>
                <Terrain />
              </ListItemIcon>
              <ListItemText primary="Soil Analysis" />
            </ListItem>
          </Tooltip>
          {!user && (
            <>
              <Tooltip title="Login" placement="right">
                <ListItem button component={Link} to="/login">
                  <ListItemIcon>
                    <LockOpen />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
              </Tooltip>
              <Tooltip title="Register" placement="right">
                <ListItem button component={Link} to="/register">
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </Tooltip>
            </>
          )}
        </List>
      </Box>
      {user && (
        <Box>
          <Divider />
          <List>
            <Tooltip title="Profile" placement="right">
              <ListItem button component={Link} to="/profile">
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Input Data" placement="right">
              <ListItem button component={Link} to="/data-input">
                <ListItemIcon>
                  <Input />
                </ListItemIcon>
                <ListItemText primary="Input Data" />
              </ListItem>
            </Tooltip>
            <Tooltip title="View Data" placement="right">
              <ListItem button component={Link} to="/view-data">
                <ListItemIcon>
                  <Visibility />
                </ListItemIcon>
                <ListItemText primary="View Data" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Logout" placement="right">
              <ListItem button onClick={logout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Tooltip>
          </List>
        </Box>
      )}
    </HoverDrawer>
  );
}

export default Navbar;
