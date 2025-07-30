import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegStar, FaMagic, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { isLoggedIn, getCurrentUser, logout } from './utils/auth';
import './App.css';

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
  
  // Get login status and user data
  const loggedIn = isLoggedIn();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    window.location.reload(); // Refresh to update navbar
  };

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
    <nav className={`navbar-sticky${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">
            Wishify <span className="navbar-logo-sparkle"><FaMagic color="#fbbf24" /></span>
          </span>
        </Link>
        {/* Desktop Nav */}
        <div className="nav-links" style={{ display: window.innerWidth < 900 ? 'none' : 'flex' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${location.pathname === link.to ? ' active' : ''}`}
            >
              {link.icon} {link.label}
              {location.pathname === link.to && <span className="nav-link-dot" />}
              <span className="nav-underline" />
            </Link>
          ))}
          {/* Right side: user or login/signup */}
          {loggedIn ? (
            <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to="/create" className="navbar-create-btn" style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}>
                ✨ Create Wish
              </Link>
              <Link 
                to="/profile" 
                style={{ 
                  color: '#2563eb', 
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.color = '#2563eb'}
              >
                Hi, {currentUser?.username || 'User'}!
              </Link>
              {/* Profile Picture */}
              <Link to="/profile" className="navbar-profile-pic" style={{ cursor: 'pointer' }}>
                {currentUser?.profileImage ? (
                  <img 
                    src={`http://localhost:5000${currentUser.profileImage}`}
                    alt="Profile"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #2563eb'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '2px solid #2563eb'
                  }}>
                    {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </Link>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ef4444', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/login" className="navbar-login-btn">Login</Link>
              <Link to="/signup" className="navbar-signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="navbar-hamburger"
          aria-label="Open menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="navbar-mobile-menu">
            <div className="navbar-mobile-logo">
              <FaRegStar size={28} color="#2563eb" />
              <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', letterSpacing: 1 }}>Wishify</span>
            </div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-mobile-link${location.pathname === link.to ? ' active' : ''}`}
              >
                {link.icon} {link.label}
                {location.pathname === link.to && <span className="navbar-mobile-link-dot" />}
              </Link>
            ))}
            {loggedIn ? (
              <div className="navbar-mobile-user" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 18 }}>
                <Link to="/create" className="navbar-mobile-create-btn" style={{ 
                  background: 'linear-gradient(135deg, #10b981, #059669)', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '100%',
                  textAlign: 'center'
                }}>
                  ✨ Create Wish
                </Link>
                <Link 
                  to="/profile"
                  style={{ 
                    color: '#2563eb', 
                    fontWeight: 500,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.color = '#2563eb'}
                >
                  Hi, {currentUser?.username || 'User'}!
                </Link>
                {/* Mobile Profile Picture */}
                <Link to="/profile" className="navbar-mobile-profile-pic" style={{ cursor: 'pointer' }}>
                  {currentUser?.profileImage ? (
                    <img 
                      src={`http://localhost:5000${currentUser.profileImage}`}
                      alt="Profile"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #2563eb'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      border: '2px solid #2563eb'
                    }}>
                      {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ef4444', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
                <Link to="/login" className="navbar-mobile-login-btn">Login</Link>
                <Link to="/signup" className="navbar-mobile-signup-btn">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 