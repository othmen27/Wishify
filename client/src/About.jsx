import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGift, FaShareAlt, FaHeart, FaCheck, FaLink, FaShieldAlt, FaMagic, FaUsers, FaGlobe } from 'react-icons/fa';
import { isLoggedIn } from './utils/auth';
import usePageTitle from './hooks/usePageTitle';
import './App.css';

const About = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  
  usePageTitle('About Wishify');

  const handleGetStarted = () => {
    if (loggedIn) {
      navigate('/wishlist');
    } else {
      navigate('/signup');
    }
  };

  const handleExploreWishes = () => {
    navigate('/discover');
  };

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            Make a wish. Share it. Get it.
          </h1>
          <p className="about-hero-subtitle">
            A platform that turns dreams into reality — one gift at a time.
          </p>
          <div className="about-hero-illustration">
            <div className="gift-illustration">
              <FaGift className="gift-icon" />
              <div className="sparkles">
                <span className="sparkle">✨</span>
                <span className="sparkle">💫</span>
                <span className="sparkle">⭐</span>
              </div>
            </div>
          </div>
          {!loggedIn && (
            <button className="about-cta-button" onClick={handleGetStarted}>
              Start Your Wishlist
            </button>
          )}
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="about-section-content">
          <h2 className="about-section-title">Our Mission</h2>
          <p className="about-mission-text">
            We built Wishify because everyone deserves to dream — and be seen.
            Whether it's a birthday gift, a dream gadget, or just something you've been wanting, 
            Wishify helps you gather your wishes and share them with the people who care.
          </p>
          <div className="mission-features">
            <div className="mission-feature">
              <FaHeart className="mission-icon" />
              <span>Make it easy to dream out loud</span>
            </div>
            <div className="mission-feature">
              <FaGift className="mission-icon" />
              <span>Help friends and family give meaningful gifts</span>
            </div>
            <div className="mission-feature">
              <FaGlobe className="mission-icon" />
              <span>Encourage sharing, not shopping</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="about-how-it-works">
        <div className="about-section-content">
          <h2 className="about-section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon">
                <FaMagic />
              </div>
              <h3>Create Your Wishlist</h3>
              <p>Sign up and add your dreams</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <FaShareAlt />
              </div>
              <h3>Share It</h3>
              <p>Send your wishlist to friends, family, or even followers</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <FaGift />
              </div>
              <h3>Get Surprised</h3>
              <p>Watch the magic happen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why People Love Wishify */}
      <section className="about-why-love">
        <div className="about-section-content">
          <h2 className="about-section-title">Why People Love Wishify</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaCheck className="feature-icon" />
              <h3>Easy to use, beautiful design</h3>
              <p>Intuitive interface that makes creating and sharing wishes effortless</p>
            </div>
            <div className="feature-card">
              <FaLink className="feature-icon" />
              <h3>Share with a simple link</h3>
              <p>One click to share your entire wishlist with anyone, anywhere</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3>Private by default, public by choice</h3>
              <p>Your privacy matters. Control who sees your wishes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-story">
        <div className="about-section-content">
          <h2 className="about-section-title">Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Created by a team who's obsessed with gifting and making life more joyful.
                We believe in the power of small surprises — and big dreams.
              </p>
              <p>
                Wishify was born from the simple idea that everyone deserves to be seen and heard.
                Whether it's a child's birthday wish or an adult's dream gadget, every wish matters.
              </p>
            </div>
            <div className="story-illustration">
              <FaUsers className="story-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="about-join">
        <div className="about-section-content">
          <h2 className="about-section-title">Join Us</h2>
          <div className="join-buttons">
            <button className="join-primary-btn" onClick={handleGetStarted}>
              🚀 Start Your Wishlist
            </button>
            <button className="join-secondary-btn" onClick={handleExploreWishes}>
              🔍 Explore Wishes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 