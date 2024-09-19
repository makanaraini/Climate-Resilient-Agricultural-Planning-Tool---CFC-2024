import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password });
      if (response.data.msg === "User created successfully") {
        // Automatically log in the user after successful registration
        const loginResponse = await axios.post('http://localhost:5000/api/login', { username, password });
        if (loginResponse.data.access_token) {
          localStorage.setItem('token', loginResponse.data.access_token);
          setAuth(true);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('Registration failed. Username might already exist.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
