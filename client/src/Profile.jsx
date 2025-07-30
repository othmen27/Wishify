import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaypal, FaDollarSign, FaUser, FaEnvelope, FaSave, FaArrowLeft, FaCamera, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { isLoggedIn, getCurrentUser, logout } from './utils/auth';
import './App.css';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    paypalEmail: '',
    cashappUsername: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Load current user data
    const user = getCurrentUser();
    if (user) {
      setFormData({
        username: user.username || '',
        paypalEmail: user.paypalEmail || '',
        cashappUsername: user.cashappUsername || ''
      });
      // Set profile image if exists
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [navigate]);

  // Update image preview when user data changes
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.profileImage && !imagePreview) {
      setImagePreview(user.profileImage);
    }
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      console.log('Form data being sent:', formData); // Debug log
      console.log('Profile image:', profileImage); // Debug log

      let requestBody;
      let headers = {
        'Authorization': `Bearer ${token}`
      };

      if (profileImage) {
        // If there's a file, use FormData
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('paypalEmail', formData.paypalEmail);
        formDataToSend.append('cashappUsername', formData.cashappUsername);
        formDataToSend.append('profileImage', profileImage);
        requestBody = formDataToSend;
        console.log('Sending FormData with file'); // Debug log
        // Don't set Content-Type for FormData - browser will set it automatically with boundary
      } else {
        // If no file, send JSON
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(formData);
        console.log('Sending JSON data:', requestBody); // Debug log
      }

      console.log('Request headers:', headers); // Debug log

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers,
        body: requestBody
      });

      console.log('Response status:', response.status); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        setMessage('Profile updated successfully!');
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and payment information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Profile Picture Section */}
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:5000${imagePreview}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', imagePreview);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  currentUser.username.charAt(0).toUpperCase()
                )}
              </div>
              <label 
                htmlFor="profile-image" 
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <FaCamera size={12} />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{currentUser.username}</h2>
              <p className="text-gray-600 flex items-center">
                <FaEnvelope className="mr-2" size={14} />
                {currentUser.email}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">Status: </span>
                <span className="text-sm text-green-600 ml-1 flex items-center">
                  <FaCheckCircle size={12} className="mr-1" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Profile Information Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Profile Information
              </h3>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Payment Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaDollarSign className="mr-2 text-green-600" />
                Payment Information
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Add your payment information so others can send you money for your wishes
              </p>
            </div>

            {/* PayPal Email */}
            <div>
              <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaPaypal className="mr-2 text-blue-600" />
                PayPal Email
              </label>
              <input
                type="email"
                id="paypalEmail"
                name="paypalEmail"
                value={formData.paypalEmail}
                onChange={handleInputChange}
                placeholder="your-email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the email associated with your PayPal account
              </p>
            </div>

            {/* CashApp Username */}
            <div>
              <label htmlFor="cashappUsername" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaDollarSign className="mr-2 text-green-600" />
                CashApp Username
              </label>
              <input
                type="text"
                id="cashappUsername"
                name="cashappUsername"
                value={formData.cashappUsername}
                onChange={handleInputChange}
                placeholder="$yourusername"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your CashApp username (with or without the $ symbol)
              </p>
            </div>

            {/* Messages */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 