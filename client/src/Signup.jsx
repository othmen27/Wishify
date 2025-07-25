import React, { useState } from 'react';
import { FaGift, FaMagic, FaGoogle, FaFacebook, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import './App.css';
import Leaderboard from './components/Leaderboard.jsx'; 

const confettiColors = ['#a5b4fc', '#fbbf24', '#60a5fa', '#f472b6', '#34d399'];

function getPasswordStrength(password) {
  if (!password) return { label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score === 0) return { label: 'Too short', color: '#ef4444' };
  if (score === 1) return { label: 'Weak', color: '#fbbf24' };
  if (score === 2) return { label: 'Medium', color: '#f59e42' };
  if (score === 3) return { label: 'Strong', color: '#34d399' };
  if (score === 4) return { label: 'Very strong', color: '#2563eb' };
}

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [easterEgg, setEasterEgg] = useState('');
  const [confetti, setConfetti] = useState([]);

  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!name) errs.name = 'Name required';
    if (!email) errs.email = 'Email required';
    if (!password) errs.password = 'Password required';
    if (!confirmPassword) errs.confirmPassword = 'Confirm your password';
    if (password && confirmPassword && password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agree) errs.agree = 'You must agree to continue';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEasterEgg('');
    const errs = validate();
    if (name.toLowerCase() === 'genie') {
      setEasterEgg('Welcome, Wish Master 🧞‍♂️!');
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Confetti burst
      setConfetti(Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 60 + 10,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.7,
        key: i
      })));
      setTimeout(() => setConfetti([]), 2200);
    }, 1500);
  };

  return (
    <div className="auth-root" style={{ flexDirection: window.innerWidth < 900 ? 'column' : 'row', position: 'relative' }}>
      {/* Left Side (illustration, only on desktop) */}
      <div className="auth-illustration-fullheight">
        <Leaderboard />
      </div>
      {/* Right Side (form) */}
      <div className="auth-form-side">
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Confetti */}
          {confetti.map(c => (
            <div key={c.key} style={{
              position: 'absolute',
              left: `${c.left}%`,
              top: `${c.top}%`,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: c.color,
              opacity: 0.8,
              animation: `confetti-fall 1.7s ${c.delay}s cubic-bezier(.6,.2,.4,1)`,
              pointerEvents: 'none',
            }} />
          ))}
          {/* Logo */}
          <div className="auth-logo">
            <FaGift size={32} color={'#2563eb'} />
            <span style={{ fontWeight: 700, fontSize: 24 }}>Wishify</span>
            <FaMagic size={20} color={'#a5b4fc'} />
          </div>
          <div className="auth-title">Create your Wishify account ✨</div>
          <div className="auth-subtitle">Start building your dream wishlist</div>
          {/* Name */}
          <div className="auth-input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`auth-input${errors.name ? ' error' : name ? ' success' : ''}`}
              autoFocus
            />
            {name && !errors.name && <FaCheckCircle color="#34d399" className="auth-input-icon" />}
            {errors.name && <FaTimesCircle color="#ef4444" className="auth-input-icon" />}
            {errors.name && (
              <div className="auth-validation">
                <span style={{ marginRight: 4 }}>✖</span>{errors.name}
              </div>
            )}
          </div>
          {/* Email */}
          <div className="auth-input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`auth-input${errors.email ? ' error' : email ? ' success' : ''}`}
            />
            {email && !errors.email && <FaCheckCircle color="#34d399" className="auth-input-icon" />}
            {errors.email && <FaTimesCircle color="#ef4444" className="auth-input-icon" />}
            {errors.email && (
              <div className="auth-validation">
                <span style={{ marginRight: 4 }}>✖</span>{errors.email}
              </div>
            )}
          </div>
          {/* Password */}
          <div className="auth-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`auth-input${errors.password ? ' error' : password ? ' success' : ''}`}
            />
            <span
              onClick={() => setShowPassword(v => !v)}
              className="auth-input-eye"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {password && !errors.password && <FaCheckCircle color="#34d399" className="auth-input-icon" />}
            {errors.password && <FaTimesCircle color="#ef4444" className="auth-input-icon" />}
            {errors.password && (
              <div className="auth-validation">
                <span style={{ marginRight: 4 }}>✖</span>{errors.password}
              </div>
            )}
            {/* Password strength */}
            {password && (
              <div className="auth-password-strength" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </div>
            )}
          </div>
          {/* Confirm Password */}
          <div className="auth-input-group">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`auth-input${errors.confirmPassword ? ' error' : confirmPassword ? ' success' : ''}`}
            />
            <span
              onClick={() => setShowConfirm(v => !v)}
              className="auth-input-eye"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
            {confirmPassword && !errors.confirmPassword && <FaCheckCircle color="#34d399" className="auth-input-icon" />}
            {errors.confirmPassword && <FaTimesCircle color="#ef4444" className="auth-input-icon" />}
            {errors.confirmPassword && (
              <div className="auth-validation">
                <span style={{ marginRight: 4 }}>✖</span>{errors.confirmPassword}
              </div>
            )}
          </div>
          {/* Agree to terms */}
          <div className="auth-checkbox-group">
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              id="agree"
              style={{ accentColor: '#2563eb' }}
            />
            <label htmlFor="agree" className="auth-checkbox-label">
              I agree to the <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Terms</a> and <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Privacy Policy</a>
            </label>
          </div>
          {/* Easter Egg */}
          {easterEgg && (
            <div className="auth-easter-egg">{easterEgg}</div>
          )}
          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="auth-btn"
            style={loading ? { background: 'linear-gradient(90deg, #a5b4fc 0%, #60a5fa 100%)', boxShadow: '0 0 16px #a5b4fc' } : success ? {} : {}}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner" style={{ width: 18, height: 18, border: '3px solid #fff', borderTop: '3px solid #a5b4fc', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                Loading...
              </span>
            ) : success ? (
              <span>🎉 Account Created!</span>
            ) : (
              <span>🎁 Create My Account</span>
            )}
          </button>
          {/* Divider */}
          <div className="auth-divider">
            <span>or sign up with</span>
          </div>
          {/* Alternative signup options */}
          <div className="auth-alt-btns">
            <button type="button" className="auth-alt-btn google">
              <FaGoogle /> Google
            </button>
            <button type="button" className="auth-alt-btn facebook">
              <FaFacebook /> Facebook
            </button>
          </div>
          {/* Links */}
          <div className="auth-links auth-links-center">
            <span>
              Already have an account?{' '}
              <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Login</a>
            </span>
          </div>
        </form>
      </div>
      {/* Mobile stacked illustration */}
      {window.innerWidth < 900 && (
        <div className="auth-mobile-illustration">
          <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="Dreamy signup" style={{ animation: 'float 3s ease-in-out infinite' }} />
          <div className="auth-mobile-illustration-desc">Let’s start building the life you dream of.</div>
        </div>
      )}
      {/* Animations are in App.css */}
    </div>
  );
};

export default Signup;
