import React, { useState } from 'react';
import { FaGift, FaMagic, FaGoogle, FaFacebook } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: false, password: false });
  const [easterEgg, setEasterEgg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({ email: !email, password: !password });
    setEasterEgg('');
    if (!email || !password) return;
    if (email.toLowerCase() === 'santa@northpole.com') {
      setEasterEgg('Santa already has a wishlist 🎅');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Logging in with Email: ${email}`);
    }, 1500);
  };

  // Responsive split layout
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      background: '#f8fafc',
      color: '#18181b',
      transition: 'background 0.3s, color 0.3s',
    }}>
      {/* Left Side (illustration, only on desktop) */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #a5b4fc 0%, #f1f5fe 100%)',
        display: window.innerWidth < 900 ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        padding: 32,
        position: 'relative',
      }}>
        <div>
          <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="Dreamy wishlist" style={{ width: 260, marginBottom: 24 }} />
          <div style={{ fontSize: 22, fontWeight: 600, color: '#2563eb' }}>
            Let’s make dreams happen.
          </div>
          <div style={{ marginTop: 16, color: '#64748b' }}>
            Animated stars, gifts, and wishlists await you!
          </div>
        </div>
      </div>
      {/* Right Side (form) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        padding: 32,
        position: 'relative',
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 16px rgba(37,99,235,0.10)',
            padding: '2.5rem 2rem',
            minWidth: 320,
            maxWidth: 380,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <FaGift size={32} color={'#2563eb'} />
            <span style={{ fontWeight: 700, fontSize: 24 }}>Wishify</span>
            <FaMagic size={20} color={'#a5b4fc'} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 2 }}>
            Welcome back to Wishify 🎁
          </div>
          <div style={{ color: '#64748b', marginBottom: 10 }}>
            Login to access your wishlists
          </div>
          {/* Email */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 8,
                border: error.email ? '2px solid #ef4444' : '2px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                marginBottom: 4,
                background: '#f8fafc',
                color: '#18181b',
                transition: 'border 0.2s',
                textAlign: 'center',
              }}
              autoFocus
            />
            {error.email && (
              <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2, alignSelf: 'flex-start' }}>
                <span style={{ marginRight: 4 }}>✖</span>Email required
              </div>
            )}
          </div>
          {/* Password */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 8,
                border: error.password ? '2px solid #ef4444' : '2px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                marginBottom: 4,
                background: '#f8fafc',
                color: '#18181b',
                transition: 'border 0.2s',
                textAlign: 'center',
              }}
            />
            {error.password && (
              <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2, alignSelf: 'flex-start' }}>
                <span style={{ marginRight: 4 }}>✖</span>Password required
              </div>
            )}
          </div>
          {/* Remember Me */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, marginBottom: 2 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              id="rememberMe"
              style={{ accentColor: '#2563eb' }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: 15, color: '#18181b' }}>
              Remember Me
            </label>
          </div>
          {/* Easter Egg */}
          {easterEgg && (
            <div style={{ color: '#fbbf24', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{easterEgg}</div>
          )}
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading
                ? 'linear-gradient(90deg, #a5b4fc 0%, #60a5fa 100%)'
                : 'linear-gradient(90deg, #60a5fa 0%, #a5b4fc 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '1rem',
              fontSize: '1.15rem',
              fontWeight: 700,
              marginTop: 8,
              marginBottom: 8,
              boxShadow: loading ? '0 0 16px #a5b4fc' : '0 2px 8px rgba(37,99,235,0.10)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'box-shadow 0.2s, background 0.2s',
              position: 'relative',
            }}
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
          <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8', margin: '10px 0', fontSize: 15 }}>
            <span style={{ background: '#fff', padding: '0 10px' }}>or</span>
          </div>
          {/* Alternative login options */}
          <div style={{ width: '100%', display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 6 }}>
            <button type="button" style={{
              background: '#fff',
              color: '#ea4335',
              border: '1.5px solid #cbd5e1',
              borderRadius: 8,
              padding: '0.6rem 1.2rem',
              fontWeight: 600,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}>
              <FaGoogle /> Google
            </button>
            <button type="button" style={{
              background: '#fff',
              color: '#1877f3',
              border: '1.5px solid #cbd5e1',
              borderRadius: 8,
              padding: '0.6rem 1.2rem',
              fontWeight: 600,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}>
              <FaFacebook /> Facebook
            </button>
          </div>
          {/* Links */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 6 }}>
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
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#f1f5fe',
        }}>
          <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="Dreamy wishlist" style={{ width: 180, marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 600, color: '#2563eb' }}>
            Let’s make dreams happen.
          </div>
        </div>
      )}
      {/* Spinner animation keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
