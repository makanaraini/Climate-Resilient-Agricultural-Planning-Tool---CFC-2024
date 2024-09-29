import React, { useState, useEffect } from 'react.js';
import { Snackbar, IconButton, List, ListItem, ListItemText, Drawer, Badge } from '@mui/material.js';
import CloseIcon from '@mui/icons-material/Close.js';
import NotificationsIcon from '@mui/icons-material/Notifications.js';
import axios from 'axios.js';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setNotifications(response.data);
        if (response.data.length > 0) {
          setOpen(true);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={toggleDrawer}
        className="hover:bg-green-100 transition-colors duration-300"
      >
        <Badge
          badgeContent={notifications.length}
          color="secondary"
          className="animate-pulse"
        >
          <NotificationsIcon className="text-green-600" />
        </Badge>
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          className: "bg-gradient-to-b from-green-50 to-blue-50",
        }}
      >
        <List sx={{ width: 300 }} className="p-4">
          {notifications.map((notification, index) => (
            <ListItem
              key={index}
              className="mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <ListItemText
                primary={
                  <span className="text-lg font-semibold text-green-700">
                    {notification.title}
                  </span>
                }
                secondary={
                  <span className="text-sm text-gray-600">
                    {notification.message}
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={
          <span className="text-green-700">
            {notifications.length > 0 ? notifications[0].message : ''}
          </span>
        }
        ContentProps={{
          className: "bg-green-100 border-l-4 border-green-500 text-green-700 p-4",
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            className="text-green-700 hover:text-green-900"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default NotificationSystem;
