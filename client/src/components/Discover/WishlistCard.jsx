import React from 'react';
import { FaHeart, FaShareAlt, FaEye, FaGift } from 'react-icons/fa';
import '../../App.css';

const WishlistCard = ({ wishlist }) => {
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

  return (
    <div className="wishlist-card">
      <div className="wishlist-card-header">
        <div className="wishlist-card-avatar">
          <FaGift size={24} />
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