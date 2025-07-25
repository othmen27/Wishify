import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegStar, FaSparkles, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home', icon: <span role="img" aria-label="home">🏠</span> },
  { to: '/wishlist', label: 'My Wishlist', icon: <span role="img" aria-label="wishlist">🎁</span> },
  { to: '/discover', label: 'Discover', icon: <span role="img" aria-label="discover">🔍</span> },
  { to: '/about', label: 'About', icon: <span role="img" aria-label="about">📖</span> },
  // { to: '/blog', label: 'Blog', icon: <span role="img" aria-label="blog">💬</span> },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  // Simulate user login state
  const isLoggedIn = false;

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false); // close mobile menu on route change
  }, [location.pathname]);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        boxShadow: scrolled ? '0 2px 16px rgba(44,62,80,0.07)' : 'none',
        transition: 'background 0.3s, box-shadow 0.3s',
        backdropFilter: scrolled ? 'blur(6px)' : 'none',
      }}
    >
      <div className="container flex-between" style={{ alignItems: 'center', padding: '0.7rem 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontWeight: 700, fontSize: '1.5rem', color: '#2563eb', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
            Wishify <span style={{ filter: 'drop-shadow(0 0 6px #a5b4fc)' }}><FaSparkles color="#fbbf24" style={{ marginLeft: 2, animation: 'sparkle 2.5s infinite alternate' }} /></span>
          </span>
        </Link>
        {/* Desktop Nav */}
        <div className="nav-links" style={{ display: window.innerWidth < 900 ? 'none' : 'flex', gap: '2.2rem', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: location.pathname === link.to ? '#2563eb' : '#2c3e50',
                fontWeight: location.pathname === link.to ? 700 : 500,
                fontSize: '1.08rem',
                textDecoration: 'none',
                position: 'relative',
                transition: 'color 0.2s',
              }}
            >
              {link.icon} {link.label}
              {location.pathname === link.to && (
                <span style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: -6,
                  transform: 'translateX(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#a5b4fc',
                  boxShadow: '0 0 8px #a5b4fc',
                }} />
              )}
              <span className="nav-underline" style={{
                position: 'absolute',
                left: 0,
                bottom: -2,
                width: '100%',
                height: 2,
                background: '#2563eb',
                borderRadius: 2,
                opacity: 0,
                transform: 'scaleX(0)',
                transition: 'opacity 0.2s, transform 0.2s',
              }} />
            </Link>
          ))}
          {/* Right side: user or login/signup */}
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <FaUserCircle size={28} color="#2563eb" style={{ cursor: 'pointer' }} />
              {/* Dropdown menu would go here */}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', padding: '0.5rem 1.1rem', borderRadius: 8, border: 'none', background: 'none', transition: 'background 0.2s' }}>Login</Link>
              <Link to="/signup" style={{ color: '#fff', background: 'linear-gradient(90deg, #60a5fa 0%, #a5b4fc 100%)', fontWeight: 700, textDecoration: 'none', padding: '0.5rem 1.1rem', borderRadius: 8, boxShadow: '0 0 12px #a5b4fc', border: 'none', transition: 'box-shadow 0.2s, background 0.2s' }}>Sign Up</Link>
            </div>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{
            display: window.innerWidth < 900 ? 'block' : 'none',
            background: 'none',
            border: 'none',
            fontSize: 28,
            color: '#2563eb',
            cursor: 'pointer',
            zIndex: 101,
          }}
          aria-label="Open menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '80vw',
              maxWidth: 340,
              height: '100vh',
              background: 'rgba(255,255,255,0.98)',
              boxShadow: '-2px 0 24px #a5b4fc44',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              padding: '2.5rem 1.5rem',
              animation: 'slideInRight 0.3s',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <FaRegStar size={28} color="#2563eb" />
              <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', letterSpacing: 1 }}>Wishify</span>
            </div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: location.pathname === link.to ? '#2563eb' : '#2c3e50',
                  fontWeight: location.pathname === link.to ? 700 : 500,
                  fontSize: '1.15rem',
                  textDecoration: 'none',
                  marginBottom: 18,
                  position: 'relative',
                }}
              >
                {link.icon} {link.label}
                {location.pathname === link.to && (
                  <span style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -6,
                    transform: 'translateX(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#a5b4fc',
                    boxShadow: '0 0 8px #a5b4fc',
                  }} />
                )}
              </Link>
            ))}
            {isLoggedIn ? (
              <div style={{ marginTop: 24 }}>
                <FaUserCircle size={28} color="#2563eb" style={{ cursor: 'pointer' }} />
                {/* Dropdown menu would go here */}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
                <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', padding: '0.5rem 1.1rem', borderRadius: 8, border: 'none', background: 'none', transition: 'background 0.2s' }}>Login</Link>
                <Link to="/signup" style={{ color: '#fff', background: 'linear-gradient(90deg, #60a5fa 0%, #a5b4fc 100%)', fontWeight: 700, textDecoration: 'none', padding: '0.5rem 1.1rem', borderRadius: 8, boxShadow: '0 0 12px #a5b4fc', border: 'none', transition: 'box-shadow 0.2s, background 0.2s' }}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes sparkle {
          0% { opacity: 1; filter: drop-shadow(0 0 0 #fbbf24); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 8px #fbbf24); }
          100% { opacity: 1; filter: drop-shadow(0 0 0 #fbbf24); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .nav-links a:hover .nav-underline {
          opacity: 1 !important;
          transform: scaleX(1) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 