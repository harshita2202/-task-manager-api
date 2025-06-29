import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token); // store token in context
      navigate('/habits');
    } else {
      setMessage(data.error || 'Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        padding: '2rem', background: '#fff', borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)', textAlign: 'center'
      }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '10px', margin: '10px 0', width: '100%' }}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '10px', margin: '10px 0', width: '100%' }}
          />
          <br />
          <button type="submit" style={{ padding: '10px 20px', width: '100%' }}>
            Login
          </button>
        </form>
        {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
        <p style={{ marginTop: '1rem' }}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
