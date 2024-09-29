import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom.js';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material.js';
import { useAuth } from '../contexts/AuthContext.js';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material.js';
import { supabase } from '../utils/supabaseClient.js'; // Import Supabase client

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(''); // Change username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Use Supabase signUp method
      const { user, error: signUpError } = await supabase.auth.signUp({
        email, // Use email instead of username
        password,
      });

      if (signUpError) throw signUpError; // Handle sign-up error

      console.log('Registration successful:', user);

      // Automatically log in after successful registration
      const { data: loginResponse, error: loginError } = await supabase.auth.signIn({
        email,
        password,
      });

      if (loginError) throw loginError; // Handle login error

      console.log('Auto-login response:', loginResponse);
      login(loginResponse.access_token); // Assuming login function accepts access_token
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error.message);
      setError(error.message || 'Registration failed. Please try again.');
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
            id="email" // Change id to email
            label="Email" // Change label to Email
            name="email" // Change name to email
            autoComplete="email" // Change autoComplete to email
            autoFocus
            value={email} // Use email state
            onChange={(e) => setEmail(e.target.value)} // Update email state
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
