import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // Ensure .js extension is added
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Keep as is
import CssBaseline from '@mui/material/CssBaseline'; // Add .js extension
import './index.css'; // Ensure this is correct
import '@fontsource/roboto'; // Keep as is
import reportWebVitals from './reportWebVitals.js'; // Add .js extension

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

