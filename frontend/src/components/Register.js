import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient';

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError) throw signUpError;

      console.log('Registration successful:', data.user);

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) throw loginError;

      console.log('Auto-login response:', loginData);
      login(loginData.session.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error.message);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="mt-16">
      <Box className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md">
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
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-full transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
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
