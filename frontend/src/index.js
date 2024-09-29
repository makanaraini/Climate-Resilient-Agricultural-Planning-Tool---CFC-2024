import React from 'react';
import ReactDOM from 'react-dom/client'; // Change this import
import App from './App.js'; // Added .js extension
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline.js'; // Added .js extension
import './index.css';
import '@fontsource/roboto'; // Import Roboto font
import reportWebVitals from './reportWebVitals.js'; // Added .js extension

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  spacing: 8, // Ensure spacing is defined
});

// Use createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

