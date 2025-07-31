import React, { useState, useEffect } from 'react';
import { FaGift, FaListAlt, FaShareAlt, FaCrown, FaFire, FaChartLine, FaEye } from 'react-icons/fa';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getCurrentUser, getWishes } from './utils/auth';
import usePageTitle from './hooks/usePageTitle';
import Leaderboard from './components/Leaderboard';

const Home = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const currentUser = getCurrentUser();
  const [recentWishes, setRecentWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  
  usePageTitle('Home');

  const handleImageError = (wishId) => {
    setFailedImages(prev => new Set(prev).add(wishId));
  };

  useEffect(() => {
    const fetchRecentWishes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/wishes/public');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data); // Debug log
          // Extract wishes array from the response
          const wishes = data.wishes || data || [];
          console.log('Extracted wishes:', wishes); // Debug log
          // Get the 6 most recent wishes
          setRecentWishes(wishes.slice(0, 6));
        } else {
          console.error('Failed to fetch wishes:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching recent wishes:', error);
        setError('Failed to load recent wishes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentWishes();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

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

      {/* Main Content Grid */}
      <div className="landing-main-grid">
        {/* Left Column - Main Content */}
        <div className="landing-main-content">
          {/* Work in Progress Section */}
          <div className="landing-illustration">
            <div className="wip-container">
              <div className="wip-icon">🚧</div>
              <h3 className="wip-title">Work in Progress</h3>
              <p className="wip-description">We're working on adding amazing content here!</p>
              <p className="wip-subtitle">Share your wishes and help us build something special</p>
            </div>
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

          {/* Recent Wishes Section */}
          <div className="recent-wishes-section">
            <div className="recent-wishes-header">
              <h2 className="recent-wishes-title">Recent Wishes</h2>
              <button 
                className="recent-wishes-more-btn"
                onClick={() => navigate('/discover')}
              >
                More <FaEye />
              </button>
            </div>
            
            {loading ? (
              <div className="recent-wishes-loading">Loading recent wishes...</div>
            ) : error ? (
              <div className="recent-wishes-error">{error}</div>
            ) : recentWishes.length > 0 ? (
              <div className="recent-wishes-grid">
                {recentWishes.map(wish => (
                  <div 
                    key={wish._id} 
                    className="recent-wish-card"
                    onClick={() => navigate(`/wish/${wish._id}`)}
                  >
                    <div className="recent-wish-header">
                      <div className="recent-wish-user">
                        {wish.user?.profileImage && !failedImages.has(wish._id) ? (
                          <img 
                            src={wish.user.profileImage} 
                            alt={wish.user.username} 
                            className="recent-wish-avatar-img"
                            onError={() => handleImageError(wish._id)}
                          />
                        ) : (
                          <div className="recent-wish-avatar">
                            {wish.user?.username?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                        )}
                        <span className="recent-wish-username">{wish.user?.username || 'Anonymous'}</span>
                      </div>
                      <span className="recent-wish-date">{formatDate(wish.createdAt)}</span>
                    </div>
                    <h3 className="recent-wish-title">{wish.title}</h3>
                    {wish.description && (
                      <p className="recent-wish-description">"{wish.description}"</p>
                    )}
                    
                    {/* Show first image if available */}
                    {(wish.imageUrl || (wish.imageUrls && wish.imageUrls.length > 0)) && (
                      <div className="recent-wish-image">
                        <img 
                          src={wish.imageUrl || wish.imageUrls[0]} 
                          alt={wish.title}
                          className="recent-wish-image-content"
                        />
                        {/* Show image count if there are multiple images */}
                        {wish.imageUrls && wish.imageUrls.length > 0 && (
                          <div className="recent-wish-image-count">
                            +{wish.imageUrls.length} more
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="recent-wish-tags">
                      <span className={`recent-wish-tag recent-wish-tag-${wish.category}`}>
                        {wish.category}
                      </span>
                      <span className={`recent-wish-tag recent-wish-tag-${wish.priority}`}>
                        {wish.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="recent-wishes-empty">
                No public wishes yet. Be the first to share your wishes!
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Leaderboard Widget */}
        <div className="landing-sidebar">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default Home;


