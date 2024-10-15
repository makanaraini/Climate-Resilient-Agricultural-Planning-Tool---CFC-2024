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

  const navItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Planning', icon: <EventNote />, path: '/planning' },
    { text: 'Soil Analysis', icon: <Terrain />, path: '/soil-analysis' },
  ];

  const renderNavItems = (items) => (
    items.map(({ text, icon, path }) => (
      <Tooltip title={text} placement="right" key={text}>
        <ListItem
          button
          component={Link}
          to={path}
          sx={{
            backgroundColor: isActive(path) ? '#c8e6c9' : 'inherit',
            '&:hover': {
              backgroundColor: '#a5d6a7',
            },
          }}
          aria-label={text}
        >
          <ListItemIcon
            sx={{
              color: isActive(path) ? '#388e3c' : 'inherit',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#66bb6a', // Light green glow on hover
              },
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={text}
            sx={{
              color: isActive(path) ? '#388e3c' : 'inherit',
            }}
          />
        </ListItem>
      </Tooltip>
    ))
  );

  return (
    <HoverDrawer variant="permanent">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <img src={mpanziLogo} alt="Mpanzi Logo" style={{ height: '40px' }} />
        </Box>
        <List>
          {renderNavItems(navItems)}
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
                  <ListItemIcon
                    sx={{
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: '#66bb6a', // Light green glow on hover
                      },
                    }}
                  >
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
                  <ListItemIcon
                    sx={{
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: '#66bb6a', // Light green glow on hover
                      },
                    }}
                  >
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
            {renderNavItems([
              { text: 'Profile', icon: <Person />, path: '/profile' },
              { text: 'Input Data', icon: <Edit />, path: '/data-input' },
              { text: 'View Data', icon: <Visibility />, path: '/view-data' },
            ])}
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
                <ListItemIcon
                  sx={{
                    transition: 'color 0.3s',
                    '&:hover': {
                      color: '#66bb6a', // Light green glow on hover
                    },
                  }}
                >
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
