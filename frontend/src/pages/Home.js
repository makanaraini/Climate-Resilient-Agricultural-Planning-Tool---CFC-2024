import React from 'react';
import { Box, Typography, AppBar, Toolbar, Button, Container, Card, CardContent, CardActionArea, Grid, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/field.jpg';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PestControlIcon from '@mui/icons-material/PestControl';
import OpacityIcon from '@mui/icons-material/Opacity';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import increasedYieldImage from '../assets/pexels-markus-winkler-1430818-5406582.jpg';
import sustainablePracticesImage from '../assets/jnjdn.jpg';
import climateAdaptationImage from '../assets/pexels-pixabay-60013.jpg';
import mpanziLogo from '../assets/mpanzi-logo.png';
import BiotechTwoToneIcon from '@mui/icons-material/BiotechTwoTone';

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

const FeatureCard = ({ title, description, icon, link }) => (
  <Box sx={{ flex: '0 0 auto', width: '220px', mx: 2 }}>
    <CardActionArea component={Link} to={link} sx={{ height: '100%', transition: 'box-shadow 0.3s, transform 0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.10)' } }}>
      <Card sx={{ border: '1px solid #3BA935', height: '100%', bgcolor: 'rgba(255, 255, 255, 0.5)', transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' } }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  </Box>
);

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
                <FeatureCard key={index} {...feature} />
              ))}
            </Box>
          </Box>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#ADD8E6', textShadow: '2px 2px 4px #00008B', fontFamily: 'Arial, sans-serif' }}>
              Goals of Mpanzi
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: '8px', backgroundImage: `url(${increasedYieldImage})`, backgroundSize: 'cover' }}>
                  <Typography variant="h5" align="center">Increase Yield</Typography>
                  <Typography variant="body1" align="center">Implement data-driven approaches to enhance agricultural productivity.</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: '8px', backgroundImage: `url(${sustainablePracticesImage})`, backgroundSize: 'cover' }}>
                  <Typography variant="h5" align="center">Sustainable Practices</Typography>
                  <Typography variant="body1" align="center">Promote environmentally-friendly farming methods to safeguard resources.</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: '8px', backgroundImage: `url(${climateAdaptationImage})`, backgroundSize: 'cover' }}>
                  <Typography variant="h5" align="center">Adapt to Climate Change</Typography>
                  <Typography variant="body1" align="center">Develop strategies to cope with the effects of climate change on agriculture.</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
