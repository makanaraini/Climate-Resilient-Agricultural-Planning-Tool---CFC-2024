import React from 'react';
import { Drawer, List, Divider, IconButton, useTheme } from '@mui/material.js';
import { Link } from 'react-router-dom.js';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft.js';
import ListItemButton from '@mui/material/ListItemButton.js';
import ListItemIcon from '@mui/material/ListItemIcon.js';
import ListItemText from '@mui/material/ListItemText.js';
import DashboardIcon from '@mui/icons-material/Dashboard.js';
import AgricultureIcon from '@mui/icons-material/Agriculture.js';
import WaterDropIcon from '@mui/icons-material/WaterDrop.js';
import CloudIcon from '@mui/icons-material/Cloud.js';
import BugReportIcon from '@mui/icons-material/BugReport.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp.js';
import PersonIcon from '@mui/icons-material/Person.js';
import DownloadIcon from '@mui/icons-material/Download';

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        '& .MuiDrawer-paper': {
          position: 'relative',
          whiteSpace: 'nowrap',
          width: 240,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
          ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
              width: theme.spacing(9),
            },
          }),
        },
      }}
      className="shadow-xl"
    >
      <div className="flex items-center justify-end p-2 bg-green-600">
        <IconButton onClick={onClose} className="text-white hover:text-green-200">
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List component="nav" className="py-4">
        <ListItemButton
          component={Link}
          to="/"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <DashboardIcon className="text-green-600" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" className="text-gray-700" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/crop-recommendation"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <AgricultureIcon className="text-green-600" />
          </ListItemIcon>
          <ListItemText primary="Crop Recommendation" className="text-gray-700" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/soil-analysis"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <AgricultureIcon className="text-green-600" />
          </ListItemIcon>
          <ListItemText primary="Soil Analysis" className="text-gray-700" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/water-management"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <WaterDropIcon className="text-blue-500" />
          </ListItemIcon>
          <ListItemText primary="Water Management" className="text-gray-700" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/weather"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <CloudIcon className="text-blue-400" />
          </ListItemIcon>
          <ListItemText primary="Weather Details" className="text-gray-700" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/pest-disease"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <BugReportIcon className="text-red-500" />
          </ListItemIcon>
          <ListItemText primary="Pest & Disease" className="text-gray-700" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/market-trends"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <TrendingUpIcon className="text-orange-500" />
          </ListItemIcon>
          <ListItemText primary="Market Trends" className="text-gray-700" />
        </ListItemButton>
        <Divider sx={{ my: 2 }} />
        <ListItemButton
          component={Link}
          to="/profile"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <PersonIcon className="text-purple-500" />
          </ListItemIcon>
          <ListItemText primary="User Profile" className="text-gray-700" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/data-export"
          className="hover:bg-green-100 transition-colors duration-200"
        >
          <ListItemIcon>
            <DownloadIcon className="text-gray-600" />
          </ListItemIcon>
          <ListItemText primary="Data Export" className="text-gray-700" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
