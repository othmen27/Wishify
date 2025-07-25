import React, { useState } from 'react';
import { FaGift, FaMagic, FaGoogle, FaFacebook, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

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

  // Responsive split layout
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: window.innerWidth < 900 ? 'column' : 'row',
      background: '#f8fafc',
      color: '#18181b',
      transition: 'background 0.3s, color 0.3s',
      position: 'relative',
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
          <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="Dreamy signup" style={{ width: 260, marginBottom: 24, animation: 'float 3s ease-in-out infinite' }} />
          <div style={{ fontSize: 22, fontWeight: 600, color: '#2563eb' }}>
            Let’s start building the life you dream of.
          </div>
          <div style={{ marginTop: 16, color: '#64748b' }}>
            Floating gifts, stars, and wishlists await you!
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
            maxWidth: 400,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            position: 'relative',
          }}
        >
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <FaGift size={32} color={'#2563eb'} />
            <span style={{ fontWeight: 700, fontSize: 24 }}>Wishify</span>
            <FaMagic size={20} color={'#a5b4fc'} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 2 }}>
            Create your Wishify account ✨
          </div>
          <div style={{ color: '#64748b', marginBottom: 10 }}>
            Start building your dream wishlist
          </div>
          {/* Name */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 8,
                border: errors.name ? '2px solid #ef4444' : name ? '2px solid #34d399' : '2px solid #cbd5e1',
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
            {name && !errors.name && <FaCheckCircle color="#34d399" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.name && <FaTimesCircle color="#ef4444" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.name && (
              <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2, alignSelf: 'flex-start' }}>
                <span style={{ marginRight: 4 }}>✖</span>{errors.name}
              </div>
            )}
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
                border: errors.email ? '2px solid #ef4444' : email ? '2px solid #34d399' : '2px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                marginBottom: 4,
                background: '#f8fafc',
                color: '#18181b',
                transition: 'border 0.2s',
                textAlign: 'center',
              }}
            />
            {email && !errors.email && <FaCheckCircle color="#34d399" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.email && <FaTimesCircle color="#ef4444" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.email && (
              <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2, alignSelf: 'flex-start' }}>
                <span style={{ marginRight: 4 }}>✖</span>{errors.email}
              </div>
            )}
          </div>
          {/* Password */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 8,
                border: errors.password ? '2px solid #ef4444' : password ? '2px solid #34d399' : '2px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                marginBottom: 4,
                background: '#f8fafc',
                color: '#18181b',
                transition: 'border 0.2s',
                textAlign: 'center',
              }}
            />
            <span
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: 36, top: 16, cursor: 'pointer', color: '#a5b4fc' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {password && !errors.password && <FaCheckCircle color="#34d399" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.password && <FaTimesCircle color="#ef4444" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.password && (
              <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2, alignSelf: 'flex-start' }}>
                <span style={{ marginRight: 4 }}>✖</span>{errors.password}
              </div>
            )}
            {/* Password strength */}
            {password && (
              <div style={{ color: passwordStrength.color, fontSize: 13, marginTop: 2 }}>
                {passwordStrength.label}
              </div>
            )}
          </div>
          {/* Confirm Password */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 8,
                border: errors.confirmPassword ? '2px solid #ef4444' : confirmPassword ? '2px solid #34d399' : '2px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                marginBottom: 4,
                background: '#f8fafc',
                color: '#18181b',
                transition: 'border 0.2s',
                textAlign: 'center',
              }}
            />
            <span
              onClick={() => setShowConfirm(v => !v)}
              style={{ position: 'absolute', right: 36, top: 16, cursor: 'pointer', color: '#a5b4fc' }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
            {confirmPassword && !errors.confirmPassword && <FaCheckCircle color="#34d399" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.confirmPassword && <FaTimesCircle color="#ef4444" style={{ position: 'absolute', right: 12, top: 16 }} />}
            {errors.confirmPassword && (
              <div style={{ color: '#ef4444', fontSize: 13, marginTop: 2, alignSelf: 'flex-start' }}>
                <span style={{ marginRight: 4 }}>✖</span>{errors.confirmPassword}
              </div>
            )}
          </div>
          {/* Agree to terms */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              id="agree"
              style={{ accentColor: '#2563eb' }}
            />
            <label htmlFor="agree" style={{ fontSize: 15, color: '#18181b' }}>
              I agree to the <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Terms</a> and <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Privacy Policy</a>
            </label>
          </div>
          {/* Easter Egg */}
          {easterEgg && (
            <div style={{ color: '#fbbf24', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{easterEgg}</div>
          )}
          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading || success}
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
              cursor: loading || success ? 'not-allowed' : 'pointer',
              transition: 'box-shadow 0.2s, background 0.2s',
              position: window.innerWidth < 900 ? 'fixed' : 'relative',
              bottom: window.innerWidth < 900 ? 24 : 'auto',
              left: window.innerWidth < 900 ? '50%' : 'auto',
              transform: window.innerWidth < 900 ? 'translateX(-50%)' : 'none',
              zIndex: 10,
            }}
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
          <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8', margin: '10px 0', fontSize: 15 }}>
            <span style={{ background: '#fff', padding: '0 10px' }}>or sign up with</span>
          </div>
          {/* Alternative signup options */}
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
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: 14, marginTop: 6 }}>
            <span>
              Already have an account?{' '}
              <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Login</a>
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
          <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="Dreamy signup" style={{ width: 180, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }} />
          <div style={{ fontSize: 18, fontWeight: 600, color: '#2563eb' }}>
            Let’s start building the life you dream of.
          </div>
        </div>
      )}
      {/* Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes confetti-fall {
          0% { opacity: 0; transform: translateY(-40px) scale(1.2); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(120px) scale(0.7); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
