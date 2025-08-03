import React from 'react';
import config from '../config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaHeart, FaGift, FaMapMarkerAlt, FaShareAlt, FaCrown, FaEye, FaLock, FaStar, FaPaypal, FaDollarSign, FaComments } from 'react-icons/fa';
import { isLoggedIn, getCurrentUser } from '../utils/auth';
import WishlistCard from './Discover/WishlistCard';
import '../App.css';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [filteredWishes, setFilteredWishes] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser && currentUser.username === username;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userResponse = await fetch(`/api/users/${username}`);
        if (!userResponse.ok) {
          throw new Error('User not found');
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user's wishes
        const wishesResponse = await fetch(`/api/users/${username}/wishes`);
        if (wishesResponse.ok) {
          const wishesData = await wishesResponse.json();
          setWishes(wishesData.wishes || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    let filtered = [...wishes];

    switch (activeTab) {
      case 'public':
        filtered = filtered.filter(wish => wish.visibility === 'public');
        break;
      case 'private':
        if (isOwnProfile) {
          filtered = filtered.filter(wish => wish.visibility === 'private');
        } else {
          filtered = [];
        }
        break;
      case 'granted':
        filtered = filtered.filter(wish => wish.granted);
        break;
      case 'favorites':
        filtered = filtered.filter(wish => wish.favorited);
        break;
      default:
        // 'all' - show all wishes user can see
        if (!isOwnProfile) {
          filtered = filtered.filter(wish => wish.visibility === 'public');
        }
        break;
    }

    setFilteredWishes(filtered);
  }, [wishes, activeTab, isOwnProfile]);

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/user/${username}`;
    if (navigator.share) {
      navigator.share({
        title: `${username}'s Wishify Profile`,
        text: `Check out ${username}'s wishes on Wishify!`,
        url: profileUrl
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert('Profile link copied to clipboard!');
    }
  };

  const handlePayPal = () => {
    if (user?.paypalEmail) {
      // Copy email to clipboard and open PayPal send money page
      navigator.clipboard.writeText(user.paypalEmail);
      const paypalUrl = 'https://www.paypal.com/send';
      window.open(paypalUrl, '_blank');
      alert(`PayPal email copied to clipboard: ${user.paypalEmail}\n\nPayPal send money page opened. Paste the email address to send money.`);
    } else {
      alert('PayPal information not available');
    }
  };

  const handleCashApp = () => {
    if (user?.cashappUsername) {
      // Clean the Cash App username and create the link
      const cleanUsername = user.cashappUsername.replace(/^\$/, ''); // Remove leading $ if present
      const cashappUrl = `https://cash.app/$${cleanUsername}`;
      window.open(cashappUrl, '_blank');
    } else {
      alert('Cash App information not available');
    }
  };

  const handleStartChat = () => {
    if (!isLoggedIn()) {
      alert('Please log in to start a chat');
      navigate('/login');
      return;
    }
    
    if (isOwnProfile) {
      alert('You cannot chat with yourself');
      return;
    }
    
    // Navigate to chat page with the user
    navigate(`/chat?user=${user?.username}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
          <h2 className="text-xl font-semibold text-red-800 mb-2">User Not Found</h2>
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

  const totalWishes = wishes.length;
  const publicWishes = wishes.filter(w => w.visibility === 'public').length;
  const grantedWishes = wishes.filter(w => w.granted).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* User Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                {user?.profileImage ? (
                  <img 
                    src={`${config.getApiUrl()}${user.profileImage}`}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <FaEdit size={12} />
                        Settings
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-1">@{user?.username}</p>
                {user?.bio && (
                  <p className="text-gray-700 mb-2">{user.bio}</p>
                )}
                {user?.location && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaMapMarkerAlt />
                    {user.location}
                  </div>
                )}
                <p className="text-gray-500 text-sm">Member since {formatDate(user?.createdAt)}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Payment Buttons - Only show if user has payment info and it's not their own profile */}
              {!isOwnProfile && (user?.paypalEmail || user?.cashappUsername) && (
                <div className="flex items-center gap-2">
                  {user?.paypalEmail && (
                    <button
                      onClick={handlePayPal}
                      className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      title={`Send money via PayPal to ${user.username}`}
                    >
                      <FaPaypal />
                      PayPal
                    </button>
                  )}
                  {user?.cashappUsername && (
                    <button
                      onClick={handleCashApp}
                      className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      title={`Send money via Cash App to ${user.username}`}
                    >
                      <FaDollarSign />
                      Cash App
                    </button>
                  )}
                </div>
              )}
              
              {/* Start Chat Button - Only show if not own profile */}
              {!isOwnProfile && (
                <button
                  onClick={handleStartChat}
                  className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                  title={`Start a chat with ${user?.username}`}
                >
                  <FaComments />
                  Start Chat
                </button>
              )}
              

              
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaShareAlt />
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaGift className="text-blue-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">{totalWishes}</span>
            </div>
            <p className="text-gray-600">Total Wishes</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaEye className="text-green-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">{publicWishes}</span>
            </div>
            <p className="text-gray-600">Public Wishes</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaCrown className="text-yellow-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">{grantedWishes}</span>
            </div>
            <p className="text-gray-600">Granted Wishes</p>
          </div>
        </div>
      </div>

      {/* Wish List Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { key: 'all', label: 'All', icon: FaGift },
              { key: 'public', label: 'Public', icon: FaEye },
              { key: 'private', label: 'Private', icon: FaLock, show: isOwnProfile },
              { key: 'granted', label: 'Granted', icon: FaCrown },
              { key: 'favorites', label: 'Favorites', icon: FaStar }
            ].map(tab => {
              if (tab.show === false) return null;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wishes Grid */}
        <div className="p-6">
          {filteredWishes.length > 0 ? (
            <div className="space-y-4">
              {filteredWishes.map(wish => (
                <WishlistCard key={wish._id} wishlist={wish} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {activeTab === 'all' && <FaGift size={48} />}
                {activeTab === 'public' && <FaEye size={48} />}
                {activeTab === 'private' && <FaLock size={48} />}
                {activeTab === 'granted' && <FaCrown size={48} />}
                {activeTab === 'favorites' && <FaStar size={48} />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} wishes yet
              </h3>
              <p className="text-gray-500">
                {isOwnProfile 
                  ? `Start adding your ${activeTab} wishes!`
                  : `${user?.username} hasn't shared any ${activeTab} wishes yet.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 