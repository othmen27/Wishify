import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShareAlt, FaEye, FaGift } from 'react-icons/fa';
import '../../App.css';

const WishlistCard = ({ wishlist }) => {
  const navigate = useNavigate();
  // Handle the case where wishlist might be a single wish from database
  const wish = wishlist;
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.wishlist-card-action') || e.target.closest('a')) {
      return;
    }
    if (wish._id) {
      navigate(`/wish/${wish._id}`);
    }
  };

  return (
    <div className="wishlist-card cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
      <div className="wishlist-card-header">
        <div className="wishlist-card-avatar">
          {wish.user?.profileImage ? (
            <img 
              src={`http://localhost:5000${wish.user.profileImage}`}
              alt={wish.user.username}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e5e7eb'
              }}
              onError={(e) => {
                // Fallback to initial avatar if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* Fallback avatar with user's initial */}
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: wish.user?.profileImage ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #e5e7eb'
            }}
          >
            {wish.user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
        <div className="wishlist-card-userinfo">
          <div className="wishlist-card-username">
            {wish.user?.username || 'Anonymous'}
          </div>
          <div className="wishlist-card-date">
            {formatDate(wish.createdAt)}
          </div>
          <div className="wishlist-card-category">
            {wish.category}
          </div>
        </div>
      </div>
      
      <div className="wishlist-card-title">{wish.title}</div>
      
      {wish.description && (
        <div className="wishlist-card-description">"{wish.description}"</div>
      )}
      
      {wish.imageUrl && (
        <div className="wishlist-card-image">
          <img src={wish.imageUrl} alt={wish.title} />
        </div>
      )}
      
      <div className="wishlist-card-tags">
        <span className={`wishlist-card-tag wishlist-card-tag-${wish.category}`}>
          {wish.category}
        </span>
        <span className={`wishlist-card-tag wishlist-card-tag-${wish.priority}`}>
          {wish.priority}
        </span>
        <span className="wishlist-card-tag wishlist-card-tag-public">
          Public
        </span>
      </div>
      
      <div className="wishlist-card-actions">
        <button className="wishlist-card-action">
          <FaHeart /> 0
        </button>
        <button className="wishlist-card-action">
          <FaShareAlt /> 0
        </button>
        <button className="wishlist-card-action">
          <FaEye /> 0
        </button>
        {wish.link && (
          <a 
            href={wish.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="wishlist-card-action"
          >
            View Item
          </a>
        )}
      </div>
    </div>
  );
};

export default WishlistCard; 