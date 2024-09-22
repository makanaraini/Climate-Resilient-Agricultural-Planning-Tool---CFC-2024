import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { TrendingUp, Timeline, Language, Newspaper } from '@mui/icons-material';

const MarketTrends = () => {
  return (
    <Box className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <Typography variant="h4" className="text-3xl font-bold text-gray-800 mb-6">
        Market Trends
      </Typography>
      <Paper elevation={3} className="p-6 rounded-lg shadow-lg bg-white">
        <Typography variant="h6" className="text-xl font-semibold text-gray-700 mb-4">
          Current Market Trends
        </Typography>
        <Typography paragraph className="text-gray-600 mb-4">
          This section will display current market trends for various agricultural products. 
          You can include information such as price fluctuations, demand forecasts, and 
          export/import data.
        </Typography>
        <Typography paragraph className="text-gray-600 mb-2">
          In the future, you might want to add:
        </Typography>
        <List className="bg-gray-50 rounded-md p-4">
          <ListItem>
            <ListItemIcon>
              <TrendingUp className="text-green-500" />
            </ListItemIcon>
            <ListItemText primary="Price charts for different crops" className="text-gray-700" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Timeline className="text-blue-500" />
            </ListItemIcon>
            <ListItemText primary="Supply and demand predictions" className="text-gray-700" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Language className="text-purple-500" />
            </ListItemIcon>
            <ListItemText primary="International market comparisons" className="text-gray-700" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Newspaper className="text-orange-500" />
            </ListItemIcon>
            <ListItemText primary="News feed of market-influencing events" className="text-gray-700" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default MarketTrends;
