import React from 'react';
import { FaGift, FaListAlt, FaShareAlt } from 'react-icons/fa';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getCurrentUser } from './utils/auth';

const Home = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const currentUser = getCurrentUser();

  return (
    <div className="landing-container">
      {/* Conditional Header based on login status */}
      {!loggedIn ? (
        <>
          {/* Big Headline for non-logged in users */}
          <h1 className="landing-headline">
            Make a wish. Share it. Get it.
          </h1>
          {/* Call to Action */}
          <div className="landing-cta">
            <button className="landing-btn-primary" onClick={() => navigate('/signup')}>
              Start Your Wishlist
            </button>
            <button className="landing-btn-secondary" onClick={() => navigate('/login')}>
              Log In
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Welcome message for logged in users */}
          <h1 className="landing-headline">
            Welcome back, {currentUser?.username || 'User'}!
          </h1>
          <div className="landing-cta">
            <button className="landing-btn-primary" onClick={() => navigate('/wishlist')}>
              View My Wishlist
            </button>
            <button className="landing-btn-secondary" onClick={() => navigate('/discover')}>
              Discover Wishes
            </button>
          </div>
        </>
      )}

      {/* Illustrations Placeholder */}
      <div className="landing-illustration">
        <img src="https://undraw.co/api/illustrations/undraw_gift_re_qr17.svg" alt="People unboxing gifts" />
        <div className="landing-illustration-desc">Illustration: Unboxing gifts & writing wishlists</div>
      </div>

      {/* How it works */}
      <div className="landing-how">
        <h2 className="landing-how-title">How it works</h2>
        <div className="landing-how-steps">
          <div className="landing-how-step">
            <FaListAlt size={40} color="#60a5fa" />
            <h3>1. Create</h3>
            <div className="landing-how-step-desc">Sign up and start your wishlist</div>
          </div>
          <div className="landing-how-step">
            <FaGift size={40} color="#a5b4fc" />
            <h3>2. Add wishes</h3>
            <div className="landing-how-step-desc">Add anything you dream of</div>
          </div>
          <div className="landing-how-step">
            <FaShareAlt size={40} color="#2563eb" />
            <h3>3. Share</h3>
            <div className="landing-how-step-desc">Send your wishlist to friends & family</div>
          </div>
        </div>
      </div>

      {/* Screenshot Preview Placeholder */}
      <div className="landing-preview">
        <div className="landing-preview-box">
          <div className="landing-preview-label">Preview:</div>
          <div className="landing-preview-img">
            [Wishlist Screenshot Here]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


