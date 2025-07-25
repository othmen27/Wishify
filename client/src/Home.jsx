import React from 'react';
import { FaGift, FaListAlt, FaShareAlt } from 'react-icons/fa';
import './App.css';

const Home = () => {
  return (
    <div className="landing-container" style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
      {/* Big Headline */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>
        Make a wish. Share it. Get it.
      </h1>
      {/* Call to Action */}
      <div style={{ marginBottom: '2rem' }}>
        <button style={{
          background: 'linear-gradient(90deg, #60a5fa 0%, #a5b4fc 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginRight: '1rem'
        }}>
          Start Your Wishlist
        </button>
        <button style={{
          background: '#fff',
          color: '#2563eb',
          border: '2px solid #2563eb',
          borderRadius: '8px',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Log In
        </button>
      </div>
      {/* Illustrations Placeholder */}
      <div style={{ margin: '2rem 0' }}>
        <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="People unboxing gifts" style={{ width: 220, marginBottom: 16 }} />
        <div style={{ color: '#64748b', fontSize: '1rem' }}>Illustration: Unboxing gifts & writing wishlists</div>
      </div>
      {/* How it works */}
      <div style={{ margin: '2.5rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 24 }}>How it works</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <FaListAlt size={40} color="#60a5fa" />
            <h3 style={{ margin: '12px 0 6px' }}>1. Create</h3>
            <div style={{ color: '#64748b' }}>Sign up and start your wishlist</div>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <FaGift size={40} color="#a5b4fc" />
            <h3 style={{ margin: '12px 0 6px' }}>2. Add wishes</h3>
            <div style={{ color: '#64748b' }}>Add anything you dream of</div>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <FaShareAlt size={40} color="#2563eb" />
            <h3 style={{ margin: '12px 0 6px' }}>3. Share</h3>
            <div style={{ color: '#64748b' }}>Send your wishlist to friends & family</div>
          </div>
        </div>
      </div>
      {/* Screenshot Preview Placeholder */}
      <div style={{ margin: '2rem 0' }}>
        <div style={{
          background: '#f1f5fe',
          borderRadius: '16px',
          boxShadow: '0 1px 6px rgba(37,99,235,0.06)',
          padding: '2rem',
          display: 'inline-block',
        }}>
          <div style={{ color: '#64748b', marginBottom: 8 }}>Preview:</div>
          <div style={{ width: 320, height: 180, background: '#e0e7ef', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 18 }}>
            [Wishlist Screenshot Here]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
