import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShareAlt, FaEye, FaGift, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import '../App.css';

const WishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch(`/api/wishes/${id}`);
        if (!response.ok) {
          throw new Error('Wish not found');
        }
        const data = await response.json();
        setWish(data);
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
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
              {wish.user?.profileImage ? (
                <img 
                  src={`http://localhost:5000${wish.user.profileImage}`}
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
                <span>By {wish.user?.username || 'Anonymous'}</span>
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

          {/* Image */}
          {wish.imageUrl && (
            <div className="mb-6">
              <img
                src={wish.imageUrl}
                alt={wish.title}
                className="w-full h-64 object-cover rounded-lg"
              />
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
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
              <FaHeart />
              <span>0</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
              <FaShareAlt />
              <span>0</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
              <FaEye />
              <span>0</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishDetail; 