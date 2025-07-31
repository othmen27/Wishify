import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShareAlt, FaEye, FaGift } from 'react-icons/fa';
import { isLoggedIn } from '../../utils/auth';
import '../../App.css';

const WishlistCard = ({ wishlist }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(wishlist.likes || 0);
  const [sharesCount, setSharesCount] = useState(wishlist.shares || 0);
  const [viewsCount, setViewsCount] = useState(wishlist.views || 0);
  
  // Handle the case where wishlist might be a single wish from database
  const wish = wishlist;
  
  // Initialize like state when component mounts
  useEffect(() => {
    if (isLoggedIn() && wish.likedBy) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      setIsLiked(wish.likedBy.includes(currentUser._id));
    }
  }, [wish.likedBy]);
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCardClick = async (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.wishlist-card-action') || e.target.closest('a')) {
      return;
    }
    if (wish._id) {
      // Track view when card is clicked
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/wishes/${wish._id}/view`, {
          method: 'POST',
          headers
        });

        if (response.ok) {
          const data = await response.json();
          setViewsCount(data.views);
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
      
      navigate(`/wish/${wish._id}`);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      alert('Please log in to like wishes');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/wishes/${wish._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likes);
      }
    } catch (error) {
      console.error('Error liking wish:', error);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/wishes/${wish._id}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSharesCount(data.shares);
        
        // Also try to use native share API if available
        if (navigator.share) {
          navigator.share({
            title: wish.title,
            text: wish.description,
            url: `${window.location.origin}/wish/${wish._id}`
          });
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(`${window.location.origin}/wish/${wish._id}`);
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing wish:', error);
    }
  };

  // Get the first available image
  const getFirstImage = () => {
    if (wish.imageUrl) return wish.imageUrl;
    if (wish.imageUrls && wish.imageUrls.length > 0) return wish.imageUrls[0];
    return null;
  };

  const firstImage = getFirstImage();

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
          <div 
            className="wishlist-card-username cursor-pointer hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (wish.user?.username) {
                navigate(`/user/${wish.user.username}`);
              }
            }}
          >
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
      
      {/* Show first image if available */}
      {firstImage && (
        <div className="wishlist-card-image">
          <img src={firstImage} alt={wish.title} />
          {/* Show image count if there are multiple images */}
          {(wish.imageUrls && wish.imageUrls.length > 0) && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
              +{wish.imageUrls.length} more
            </div>
          )}
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
        <button 
          className={`wishlist-card-action ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
        >
          <FaHeart className={isLiked ? 'fill-current' : ''} /> {likesCount}
        </button>
        <button 
          className="wishlist-card-action"
          onClick={handleShare}
        >
          <FaShareAlt /> {sharesCount}
        </button>
        <div className="wishlist-card-action">
          <FaEye /> {viewsCount}
        </div>
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