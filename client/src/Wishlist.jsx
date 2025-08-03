import React
import config from './config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaGift, 
  FaSort,
  FaFilter,
  FaCalendarAlt,
  FaTag,
  FaStar,
  FaLock,
  FaGlobe
} from 'react-icons/fa';
import { isLoggedIn } from './utils/auth';
import './App.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Set page title
  useEffect(() => {
    document.title = 'Wishify | My Wishlist';
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    fetchWishes();
  }, [navigate]);

  const fetchWishes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/wishes/my-wishes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishes');
      }

      const data = await response.json();
      setWishes(data.wishes || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wishId) => {
    if (!window.confirm('Are you sure you want to delete this wish?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/wishes/${wishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setWishes(wishes.filter(wish => wish._id !== wishId));
      } else {
        throw new Error('Failed to delete wish');
      }
    } catch (err) {
      alert('Error deleting wish: ' + err.message);
    }
  };

  const handleToggleVisibility = async (wishId, currentVisibility) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/wishes/${wishId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visibility: currentVisibility === 'public' ? 'private' : 'public'
        })
      });

      if (response.ok) {
        setWishes(wishes.map(wish => 
          wish._id === wishId 
            ? { ...wish, visibility: currentVisibility === 'public' ? 'private' : 'public' }
            : wish
        ));
      } else {
        throw new Error('Failed to update wish');
      }
    } catch (err) {
      alert('Error updating wish: ' + err.message);
    }
  };

  const handleMarkGranted = async (wishId, currentGranted) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/wishes/${wishId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          granted: !currentGranted
        })
      });

      if (response.ok) {
        setWishes(wishes.map(wish => 
          wish._id === wishId 
            ? { ...wish, granted: !currentGranted }
            : wish
        ));
      } else {
        throw new Error('Failed to update wish');
      }
    } catch (err) {
      alert('Error updating wish: ' + err.message);
    }
  };

  const getFilteredAndSortedWishes = () => {
    let filteredWishes = [...wishes];

    // Apply filters
    switch (filter) {
      case 'public':
        filteredWishes = filteredWishes.filter(wish => wish.visibility === 'public');
        break;
      case 'private':
        filteredWishes = filteredWishes.filter(wish => wish.visibility === 'private');
        break;
      case 'granted':
        filteredWishes = filteredWishes.filter(wish => wish.granted);
        break;
      case 'not-granted':
        filteredWishes = filteredWishes.filter(wish => !wish.granted);
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredWishes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filteredWishes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'high-priority':
        filteredWishes.sort((a, b) => {
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      case 'low-priority':
        filteredWishes.sort((a, b) => {
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
      default:
        break;
    }

    return filteredWishes;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFirstImage = (wish) => {
    if (wish.imageUrl) return wish.imageUrl;
    if (wish.imageUrls && wish.imageUrls.length > 0) return wish.imageUrls[0];
    return null;
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Wishlist</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchWishes}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredWishes = getFilteredAndSortedWishes();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              Manage your wishes here. Add new ones, edit, prioritize, or mark them as granted.
            </p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            Add New Wish
          </button>
        </div>

        {/* Filter and Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'public', label: 'Public' },
                  { key: 'private', label: 'Private' },
                  { key: 'granted', label: 'Granted' },
                  { key: 'not-granted', label: 'Not Granted' }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === filterOption.key
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="high-priority">High Priority</option>
                <option value="low-priority">Low Priority</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wish Cards */}
      {filteredWishes.length === 0 ? (
        <div className="text-center py-12">
          <FaGift className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {filter === 'all' ? 'No wishes yet' : `No ${filter.replace('-', ' ')} wishes`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Start by adding your first wish!' 
              : `No wishes match the "${filter.replace('-', ' ')}" filter.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Wish
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredWishes.map(wish => (
            <div
              key={wish._id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md ${
                wish.granted ? 'opacity-75' : ''
              }`}
            >
              {/* Wish Image */}
              <div className="relative h-48 bg-gray-100">
                {getFirstImage(wish) ? (
                  <img
                    src={getFirstImage(wish)}
                    alt={wish.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaGift className="text-4xl text-gray-300" />
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {wish.granted && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <FaCheck className="inline mr-1" />
                      Granted
                    </span>
                  )}
                  <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {wish.visibility === 'public' ? <FaGlobe className="inline mr-1" /> : <FaLock className="inline mr-1" />}
                    {wish.visibility}
                  </span>
                </div>

                {/* Priority Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(wish.priority)}`}>
                    {wish.priority} priority
                  </span>
                </div>
              </div>

              {/* Wish Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {wish.title}
                </h3>
                
                {wish.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {wish.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FaTag />
                    {wish.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {formatDate(wish.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/wish/${wish._id}/edit`)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit wish"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(wish._id, wish.visibility)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title={`Make ${wish.visibility === 'public' ? 'private' : 'public'}`}
                    >
                      {wish.visibility === 'public' ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      onClick={() => handleMarkGranted(wish._id, wish.granted)}
                      className={`p-2 rounded-lg transition-colors ${
                        wish.granted
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={wish.granted ? 'Mark as not granted' : 'Mark as granted'}
                    >
                      <FaCheck />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(wish._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete wish"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 