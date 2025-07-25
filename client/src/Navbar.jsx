import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaTrophy, FaSignInAlt, FaUserPlus, FaRegStar } from 'react-icons/fa';
import './App.css';

const Navbar = () => {
  return (
    <nav style={{
      background: '#e0e7ff',
      borderBottom: '1.5px solid #c7d2fe',
      padding: '0.75rem 0',
      boxShadow: '0 2px 8px rgba(37,99,235,0.04)',
      marginBottom: '2rem',
    }}>
      <div className="container flex-between" style={{alignItems: 'center'}}>
        <div className="flex" style={{gap: '0.5rem'}}>
          <FaRegStar size={28} color="#2563eb" />
          <span style={{fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', letterSpacing: 1}}>Wishify</span>
        </div>
        <div className="flex" style={{gap: '1.5rem'}}>
          <Link to="/" className="flex" style={{gap: '0.5rem'}}><FaHome /> Home</Link>
          <Link to="/post" className="flex" style={{gap: '0.5rem'}}><FaPlusCircle /> Post Wish</Link>
          <Link to="/leaderboard" className="flex" style={{gap: '0.5rem'}}><FaTrophy /> Leaderboard</Link>
          <Link to="/login" className="flex" style={{gap: '0.5rem'}}><FaSignInAlt /> Login</Link>
          <Link to="/signup" className="flex" style={{gap: '0.5rem'}}><FaUserPlus /> Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 