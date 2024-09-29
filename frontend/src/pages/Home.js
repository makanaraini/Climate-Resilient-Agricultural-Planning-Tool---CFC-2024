import React from 'react';
import { Box, Typography, AppBar, Toolbar, Button, Container, Card, CardContent, CardActionArea, Grid, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/field.jpg'; // Assuming you have an image in the assets folder
import DashboardIcon from '@mui/icons-material/Dashboard.js';
import PestControlIcon from '@mui/icons-material/PestControl.js';
import OpacityIcon from '@mui/icons-material/Opacity.js';
import ListAltIcon from '@mui/icons-material/ListAlt.js';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined.js';
import increasedYieldImage from '../assets/pexels-markus-winkler-1430818-5406582.jpg';
import sustainablePracticesImage from '../assets/jnjdn.jpg';
import climateAdaptationImage from '../assets/pexels-pixabay-60013.jpg';
import mpanziLogo from '../assets/mpanzi-logo.png'; // Import the Mpanzi logo
import BiotechTwoToneIcon from '@mui/icons-material/BiotechTwoTone.js';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3BA935',
    },
    background: {
      default: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    h4: {
      fontWeight: 'bold',
    },
    body1: {
      fontWeight: 'light',
    },
  },
});

const features = [
  {
    title: 'Dashboard',
    description: 'Access your personalized dashboard with all your farming data, including crop performance, weather updates, and financial summaries, all in one place.',
    icon: <DashboardIcon />,
    link: '/dashboard',
  },
  {
    title: 'Reports',
    description: 'Generate and view detailed reports on your farming activities, including yield analysis, resource usage, and financial performance, to help you track progress and plan for the future.',
    icon: <ListAltIcon />,
    link: '/reports',
  },
  {
    title: 'Planning',
    description: 'Plan your farming activities with precision using our advanced planning tools, which include crop rotation schedules, planting calendars, and resource allocation.',
    icon: <InsertChartOutlinedIcon />,
    link: '/planning',
  },
  {
    title: 'Soil Analysis',
    description: 'Get detailed soil analysis reports to understand soil health, nutrient levels, and recommendations for soil improvement to ensure optimal crop growth.',
    icon: <BiotechTwoToneIcon />,
    link: '/soil-analysis',
  },
  {
    title: 'Pest and Disease Analysis',
    description: 'Monitor and analyze pest and disease occurrences in your fields, receive alerts, and get recommendations for effective pest and disease management.',
    icon: <PestControlIcon />,
    link: '/pest-disease-analysis',
  },
  {
    title: 'Water Management',
    description: 'Optimize your water usage with our water management tools, which provide irrigation schedules, water usage reports, and recommendations for efficient water use.',
    icon: <OpacityIcon />,
    link: '/water-management',
  },
];

function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', height: '100vh', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'black' }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <img src={mpanziLogo} alt="Mpanzi Logo" style={{ height: '40px', marginRight: '16px' }} />
            <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: 'Playfair Display, Merriweather' }}>
              Mpanzi
            </Typography>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, textAlign: 'center', mt: 8 }}>
          <Typography variant="h3" gutterBottom sx={{ color: '#F5F5DC', textShadow: '3px 3px 6px #E0FFE0', fontFamily: 'Cursive, serif', fontWeight: 'bold', letterSpacing: '0.1em' }}>
            Empowering Farmers through Climate-Resilient Planning
          </Typography>
        </Box>
        <Container>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' }, px: 2 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ flex: '0 0 auto', width: '220px', mx: 2 }}>
                  <CardActionArea component={Link} to={feature.link} sx={{ height: '100%', transition: 'box-shadow 0.3s, transform 0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.10)' } }}>
                    <Card sx={{ border: '1px solid #3BA935', height: '100%', bgcolor: 'rgba(255, 255, 255, 0.5)', transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#ADD8E6', textShadow: '2px 2px 4px #00008B', fontFamily: 'Arial, sans-serif' }}>
              Goals of Mpanzi
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, bgcolor: '#F5F5DC', color: '#000000' }}>
                  <img src={increasedYieldImage} alt="Increased Yield" style={{ width: '100%', height: 'auto' }} />
                  <Typography variant="h6" gutterBottom>
                    Increased Yield
                  </Typography>
                  <Typography variant="body1">
                    Boost your crop yield with our advanced planning tools.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, bgcolor: '#F5F5DC', color: '#000000' }}>
                  <img src={sustainablePracticesImage} alt="Sustainable Practices" style={{ width: '100%', height: 'auto' }} />
                  <Typography variant="h6" gutterBottom>
                    Sustainable Practices
                  </Typography>
                  <Typography variant="body1">
                    Implement sustainable farming practices to protect the environment.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, bgcolor: '#F5F5DC', color: '#000000' }}>
                  <img src={climateAdaptationImage} alt="Climate Adaptation" style={{ width: '100%', height: 'auto' }} />
                  <Typography variant="h6" gutterBottom>
                    Climate Adaptation
                  </Typography>
                  <Typography variant="body1">
                    Adapt to changing climate conditions with our expert guidance.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Button variant="contained" sx={{ bgcolor: '#3BA935', color: '#FFFFFF', mt: 2 }} component={Link} to="/register">
              Sign Up for Free
            </Button>
          </Box>
        </Container>
        <Box sx={{ bgcolor: '#F5F5DC', color: 'black', p: 3, mt: 5 }}>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Contact Us
                </Typography>
                <Typography variant="body2">
                  Email: info@mpanzi.com
                </Typography>
                <Typography variant="body2">
                  Phone: +123 456 7890
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Typography variant="body2">
                  Facebook | Twitter | Instagram
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  About Us
                </Typography>
                <Typography variant="body2">
                  Mpanzi is dedicated to empowering farmers through innovative, climate-resilient agricultural planning tools.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
