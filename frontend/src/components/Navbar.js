import React from 'react.js';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Tooltip, Divider, Box } from '@mui/material/index.js';
import { Home, Dashboard, Assessment, EventNote, Terrain, Person, ExitToApp, LockOpen, PersonAdd, Visibility, Edit } from '@mui/icons-material/index.js'; // Changed Input to Edit
import { Link, useLocation } from 'react-router-dom.js';
import { useAuth } from '../contexts/AuthContext.js';
import { styled } from '@mui/system/index.js';
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
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <HoverDrawer variant="permanent">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <img src={mpanziLogo} alt="Mpanzi Logo" style={{ height: '40px' }} />
        </Box>
        <List>
          <Tooltip title="Home" placement="right">
            <ListItem button component={Link} to="/" sx={{ backgroundColor: isActive('/') ? 'lightgreen' : 'inherit' }}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Dashboard" placement="right">
            <ListItem button component={Link} to="/dashboard" sx={{ backgroundColor: isActive('/dashboard') ? 'lightgreen' : 'inherit' }}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Reports" placement="right">
            <ListItem button component={Link} to="/reports" sx={{ backgroundColor: isActive('/reports') ? 'lightgreen' : 'inherit' }}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Planning" placement="right">
            <ListItem button component={Link} to="/planning" sx={{ backgroundColor: isActive('/planning') ? 'lightgreen' : 'inherit' }}>
              <ListItemIcon>
                <EventNote />
              </ListItemIcon>
              <ListItemText primary="Planning" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Soil Analysis" placement="right">
            <ListItem button component={Link} to="/soil-analysis" sx={{ backgroundColor: isActive('/soil-analysis') ? 'lightgreen' : 'inherit' }}>
              <ListItemIcon>
                <Terrain />
              </ListItemIcon>
              <ListItemText primary="Soil Analysis" />
            </ListItem>
          </Tooltip>
          {!user && (
            <>
              <Tooltip title="Login" placement="right">
                <ListItem button component={Link} to="/login" sx={{ backgroundColor: isActive('/login') ? 'lightgreen' : 'inherit' }}>
                  <ListItemIcon>
                    <LockOpen />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
              </Tooltip>
              <Tooltip title="Register" placement="right">
                <ListItem button component={Link} to="/register" sx={{ backgroundColor: isActive('/register') ? 'lightgreen' : 'inherit' }}>
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
              <ListItem button component={Link} to="/profile" sx={{ backgroundColor: isActive('/profile') ? 'lightgreen' : 'inherit' }}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Input Data" placement="right">
              <ListItem button component={Link} to="/data-input" sx={{ backgroundColor: isActive('/data-input') ? 'lightgreen' : 'inherit' }}>
                <ListItemIcon>
                  <Edit /> {/* Changed icon from Input to Edit */}
                </ListItemIcon>
                <ListItemText primary="Input Data" />
              </ListItem>
            </Tooltip>
            <Tooltip title="View Data" placement="right">
              <ListItem button component={Link} to="/view-data" sx={{ backgroundColor: isActive('/view-data') ? 'lightgreen' : 'inherit' }}>
                <ListItemIcon>
                  <Visibility />
                </ListItemIcon>
                <ListItemText primary="View Data" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Logout" placement="right">
              <ListItem button onClick={logout} sx={{ backgroundColor: isActive('/logout') ? 'lightgreen' : 'inherit' }}>
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
