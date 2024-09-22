import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/register', { username, password });
      console.log('Register response:', registerResponse.data);
      
      // Automatically log in after successful registration
      const loginResponse = await axios.post('http://localhost:5000/api/login', { username, password });
      console.log('Auto-login response:', loginResponse.data);
      
      if (loginResponse.data.access_token) {
        login(loginResponse.data.access_token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="mt-16">
      <Box
        className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md"
      >
        <div className="mb-6 p-3 bg-green-500 rounded-full">
          <LockOutlinedIcon className="text-white" />
        </div>
        <Typography component="h1" variant="h5" className="text-2xl font-bold text-gray-800 mb-6">
          Register
        </Typography>
        {error && <Alert severity="error" className="w-full mb-4">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="w-full">
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            className="mb-4"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            className="mb-6"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </Button>
          <Link to="/login" className="block mt-4 text-center text-green-600 hover:text-green-700 transition duration-300 ease-in-out">
            <Typography variant="body2">
              Already have an account? Login here
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
