import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Box,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Assessment,
  EventNote,
  Terrain,
  Person,
  ExitToApp,
  LockOpen,
  PersonAdd,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/system';
import mpanziLogo from '../assets/mpanzi-logo.png';

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
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5', // Light background color
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
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <HoverDrawer variant="permanent">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <img src={mpanziLogo} alt="Mpanzi Logo" style={{ height: '40px' }} />
        </Box>
        <List>
          {[
            { text: 'Home', icon: <Home />, path: '/' },
            { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
            { text: 'Reports', icon: <Assessment />, path: '/reports' },
            { text: 'Planning', icon: <EventNote />, path: '/planning' },
            { text: 'Soil Analysis', icon: <Terrain />, path: '/soil-analysis' },
          ].map(({ text, icon, path }) => (
            <Tooltip title={text} placement="right" key={text}>
              <ListItem
                button
                component={Link}
                to={path}
                sx={{
                  backgroundColor: isActive(path) ? '#c8e6c9' : 'inherit', // Light green for active items
                  '&:hover': {
                    backgroundColor: '#a5d6a7', // Darker green on hover
                  },
                }}
                aria-label={text}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(path) ? '#388e3c' : 'inherit', // Dark green for active icons
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    color: isActive(path) ? '#388e3c' : 'inherit', // Dark green for active text
                  }}
                />
              </ListItem>
            </Tooltip>
          ))}
          {!user && (
            <>
              <Tooltip title="Login" placement="right">
                <ListItem
                  button
                  component={Link}
                  to="/login"
                  sx={{
                    backgroundColor: isActive('/login') ? '#c8e6c9' : 'inherit',
                    '&:hover': {
                      backgroundColor: '#a5d6a7',
                    },
                  }}
                  aria-label="Login"
                >
                  <ListItemIcon>
                    <LockOpen />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
              </Tooltip>
              <Tooltip title="Register" placement="right">
                <ListItem
                  button
                  component={Link}
                  to="/register"
                  sx={{
                    backgroundColor: isActive('/register') ? '#c8e6c9' : 'inherit',
                    '&:hover': {
                      backgroundColor: '#a5d6a7',
                    },
                  }}
                  aria-label="Register"
                >
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
              <ListItem
                button
                component={Link}
                to="/profile"
                sx={{
                  backgroundColor: isActive('/profile') ? '#c8e6c9' : 'inherit',
                  '&:hover': {
                    backgroundColor: '#a5d6a7',
                  },
                }}
                aria-label="Profile"
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Input Data" placement="right">
              <ListItem
                button
                component={Link}
                to="/data-input"
                sx={{
                  backgroundColor: isActive('/data-input') ? '#c8e6c9' : 'inherit',
                  '&:hover': {
                    backgroundColor: '#a5d6a7',
                  },
                }}
                aria-label="Input Data"
              >
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText primary="Input Data" />
              </ListItem>
            </Tooltip>
            <Tooltip title="View Data" placement="right">
              <ListItem
                button
                component={Link}
                to="/view-data"
                sx={{
                  backgroundColor: isActive('/view-data') ? '#c8e6c9' : 'inherit',
                  '&:hover': {
                    backgroundColor: '#a5d6a7',
                  },
                }}
                aria-label="View Data"
              >
                <ListItemIcon>
                  <Visibility />
                </ListItemIcon>
                <ListItemText primary="View Data" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Logout" placement="right">
              <ListItem
                button
                onClick={logout}
                sx={{
                  backgroundColor: isActive('/logout') ? '#c8e6c9' : 'inherit',
                  '&:hover': {
                    backgroundColor: '#a5d6a7',
                  },
                }}
                aria-label="Logout"
              >
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
