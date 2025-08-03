import React, { useState } from 'react';
import config from './config';
import { FaGift, FaMagic, FaGoogle, FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import './App.css';
import Leaderboard from './components/Leaderboard';
import { useNavigate } from 'react-router-dom';
import usePageTitle from './hooks/usePageTitle';

const Login = () => {
  const navigate = useNavigate();
  usePageTitle('Login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: false, password: false, api: '' });
  const [easterEgg, setEasterEgg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: !email, password: !password, api: '' });
    setEasterEgg('');
    
    if (!email || !password) return;
    
    if (email.toLowerCase() === 'santa@northpole.com') {
      setEasterEgg('Santa already has a wishlist 🎅');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${config.getApiUrl()}/api/auth/login`, {
        email,
        password,
      });
      
      setLoading(false);
      console.log('Login successful:', response.data);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // You can store user data in localStorage or state management here
      alert(`Welcome back, ${response.data.user.username}!`);
      navigate('/discover');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.message) {
        setError({ ...error, api: error.response.data.message });
      } else {
        setError({ ...error, api: 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <div className="auth-root">
      {/* Left Side (illustration, only on desktop) */}
      <div className="auth-illustration-fullheight">
        <Leaderboard />
      </div>
      {/* Right Side (form) */}
      <div className="auth-form-side">
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Logo */}
          <div className="auth-logo">
            <FaGift size={32} color={'#2563eb'} />
            <span style={{ fontWeight: 700, fontSize: 24 }}>Wishify</span>
            <FaMagic size={20} color={'#a5b4fc'} />
          </div>
          <div className="auth-title">Welcome back to Wishify 🎁</div>
          <div className="auth-subtitle">Login to access your wishlists</div>
          {/* Email */}
          <div className="auth-input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`auth-input${error.email ? ' error' : ''}`}
              autoFocus
            />
            {error.email && (
              <div className="auth-validation">
                <span style={{ marginRight: 4 }}>✖</span>Email required
              </div>
            )}
          </div>
          {/* Password */}
          <div className="auth-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`auth-input${error.password ? ' error' : ''}`}
            />
            {error.password && (
              <div className="auth-validation">
                <span style={{ marginRight: 4 }}>✖</span>Password required
              </div>
            )}
          </div>
          {/* API Error */}
          {error.api && (
            <div className="auth-validation" style={{ color: '#ef4444', marginBottom: 8 }}>
              <span style={{ marginRight: 4 }}>✖</span>{error.api}
            </div>
          )}
          {/* Remember Me */}
          <div className="auth-checkbox-group">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              id="rememberMe"
              style={{ accentColor: '#2563eb' }}
            />
            <label htmlFor="rememberMe" className="auth-checkbox-label">
              Remember Me
            </label>
          </div>
          {/* Easter Egg */}
          {easterEgg && (
            <div className="auth-easter-egg">{easterEgg}</div>
          )}
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-btn"
            style={loading ? { background: 'linear-gradient(90deg, #a5b4fc 0%, #60a5fa 100%)', boxShadow: '0 0 16px #a5b4fc' } : {}}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner" style={{ width: 18, height: 18, border: '3px solid #fff', borderTop: '3px solid #a5b4fc', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                Loading...
              </span>
            ) : (
              <span>✨ Enter the Wishlist</span>
            )}
          </button>
          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>
          {/* Alternative login options */}
          <div className="auth-alt-btns">
            <button type="button" className="auth-alt-btn google">
              <FaGoogle /> Google
            </button>
            <button type="button" className="auth-alt-btn facebook">
              <FaFacebook /> Facebook
            </button>
          </div>
          {/* Links */}
          <div className="auth-links">
            <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Forgot Password?</a>
            <span>
              Don’t have an account?{' '}
              <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Sign up</a>
            </span>
          </div>
        </form>
      </div>
      {/* Mobile stacked illustration */}
      {window.innerWidth < 900 && (
        <div className="auth-mobile-illustration">
          <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="Dreamy wishlist" />
          <div className="auth-mobile-illustration-desc">Let’s make dreams happen.</div>
        </div>
      )}
      {/* Spinner animation keyframes are in App.css */}
    </div>
  );
};

export default Login;
