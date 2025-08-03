import React from 'react';
import config from '../config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShareAlt, FaEye, FaArrowLeft, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaComments } from 'react-icons/fa';
import { isLoggedIn, getCurrentUser } from '../utils/auth';
import '../App.css';

const WishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const currentUser = getCurrentUser();

  // Set page title based on wish data
  useEffect(() => {
    const baseTitle = 'Wishify';
    if (wish) {
      document.title = `${baseTitle} | ${wish.title || 'Wish Details'}`;
    } else if (error) {
      document.title = `${baseTitle} | Wish Not Found`;
    } else {
      document.title = `${baseTitle} | Wish Details`;
    }
  }, [wish, error]);

  useEffect(() => {
    const fetchWish = async () => {
      try {
        const response = await fetch(`${config.getApiUrl()}/api/wishes/${id}`);
        if (!response.ok) {
          throw new Error('Wish not found');
        }
        const data = await response.json();
        setWish(data);
        setLikesCount(data.likes || 0);
        setSharesCount(data.shares || 0);
        setViewsCount(data.views || 0);
        
        // Check if current user has liked this wish
        if (isLoggedIn() && data.likedBy) {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          setIsLiked(data.likedBy.includes(currentUser._id));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWish();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    if (!isLoggedIn()) {
      alert('Please log in to like wishes');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.getApiUrl()}/api/wishes/${id}/like`, {
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

  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.getApiUrl()}/api/wishes/${id}/share`, {
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
            url: window.location.href
          });
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing wish:', error);
    }
  };

  const handleChatWithUser = () => {
    if (!isLoggedIn()) {
      alert('Please log in to start a chat');
      navigate('/login');
      return;
    }
    
    if (!wish.user || !wish.user.username) {
      alert('User information not available');
      return;
    }
    
    if (currentUser && currentUser._id === wish.user._id) {
      alert('You cannot chat with yourself');
      return;
    }
    
    // Navigate to chat page with the user
    navigate(`/chat?user=${wish.user.username}`);
  };

  const nextImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getImages = () => {
    const images = [];
    if (wish.imageUrl) images.push(wish.imageUrl);
    if (wish.imageUrls && wish.imageUrls.length > 0) {
      images.push(...wish.imageUrls);
    }
    return images;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Wish Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/discover')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <FaArrowLeft />
        Back
      </button>

      {/* Wish Detail Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                if (wish.user?.username) {
                  navigate(`/user/${wish.user.username}`);
                }
              }}
            >
              {wish.user?.profileImage ? (
                <img 
                  src={`${config.getApiUrl()}${wish.user.profileImage}`}
                  alt={wish.user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initial avatar if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Fallback avatar with user's initial */}
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                style={{
                  display: wish.user?.profileImage ? 'none' : 'flex'
                }}
              >
                {wish.user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{wish.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span 
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => {
                    if (wish.user?.username) {
                      navigate(`/user/${wish.user.username}`);
                    }
                  }}
                >
                  By {wish.user?.username || 'Anonymous'}
                </span>
                <span>•</span>
                <span>{formatDate(wish.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          {wish.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">"{wish.description}"</p>
            </div>
          )}

          {/* Image Slideshow */}
          {images.length > 0 && (
            <div className="mb-6 relative">
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${wish.title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
              
              {/* Image thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800`}>
              {wish.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800`}>
              {wish.priority} priority
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {wish.visibility}
            </span>
          </div>

          {/* External Link */}
          {wish.link && (
            <div className="mb-6">
              <a
                href={wish.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaExternalLinkAlt />
                View Item
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <FaHeart className={isLiked ? 'fill-current' : ''} />
              <span>{likesCount}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FaShareAlt />
              <span>{sharesCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <FaEye />
              <span>{viewsCount}</span>
            </div>
            {wish.user && currentUser && wish.user._id !== currentUser._id && (
              <button 
                onClick={handleChatWithUser}
                className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
                title="Chat with user about this wish"
              >
                <FaComments />
                <span>Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishDetail; 