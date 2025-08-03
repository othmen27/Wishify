import React from 'react';
import config from '../config';
import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaPaypal, FaDollarSign, FaMapMarkerAlt, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader, getCurrentUser } from '../utils/auth';
import usePageTitle from '../hooks/usePageTitle';
import '../App.css';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    paypalEmail: '',
    cashappUsername: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  usePageTitle('Edit Profile');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${config.getApiUrl()}/api/users/profile/edit`, {
        headers: getAuthHeader()
      });
      
      const userData = response.data;
      setFormData({
        username: userData.username || '',
        bio: userData.bio || '',
        location: userData.location || '',
        paypalEmail: userData.paypalEmail || '',
        cashappUsername: userData.cashappUsername || ''
      });
      
      if (userData.profileImage) {
        setImagePreview(userData.profileImage);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('paypalEmail', formData.paypalEmail);
      formDataToSend.append('cashappUsername', formData.cashappUsername);
      
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await axios.put(
        `${config.getApiUrl()}/api/users/profile/edit`,
        formDataToSend,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">
            <FaEdit className="profile-icon" />
            Edit Profile
          </h1>
          <p className="profile-subtitle">
            Update your profile information and settings
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="profile-success">
            <FaCheckCircle /> Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Profile Image */}
          <div className="form-group">
            <label className="form-label">
              <FaUser className="form-label-icon" />
              Profile Picture
            </label>
            <div className="profile-image-upload">
              <div className="profile-image-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="profile-preview-img" />
                ) : (
                  <div className="profile-image-placeholder">
                    <FaUser />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profile-image-input"
                id="profile-image"
              />
              <label htmlFor="profile-image" className="profile-image-button">
                <FaEdit /> Change Photo
              </label>
            </div>
            <div className="form-help">Upload a profile picture (max 5MB)</div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="form-input"
              placeholder="Enter your username"
              maxLength={30}
            />
            <div className="form-help">This is how others will see you</div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">
              <FaFileAlt className="form-label-icon" />
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="form-textarea"
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={200}
            />
            <div className="form-help">Share a bit about yourself (optional)</div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              <FaMapMarkerAlt className="form-label-icon" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="form-input"
              placeholder="City, Country"
              maxLength={100}
            />
            <div className="form-help">Where are you located? (optional)</div>
          </div>

          {/* Payment Methods */}
          <div className="form-group">
            <label className="form-label">Payment Methods</label>
            <div className="payment-methods">
              <div className="payment-method">
                <label className="payment-label">
                  <FaPaypal className="payment-icon" />
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={formData.paypalEmail}
                  onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                  className="form-input"
                  placeholder="your-email@paypal.com"
                />
              </div>
              <div className="payment-method">
                <label className="payment-label">
                  <FaDollarSign className="payment-icon" />
                  Cash App Username
                </label>
                <input
                  type="text"
                  value={formData.cashappUsername}
                  onChange={(e) => handleInputChange('cashappUsername', e.target.value)}
                  className="form-input"
                  placeholder="$yourusername"
                />
              </div>
            </div>
            <div className="form-help">Add payment methods so others can help grant your wishes</div>
          </div>

          {/* WIP Verification Button */}
          <div className="form-group">
            <label className="form-label">Account Verification</label>
            <div className="verification-section">
              <button type="button" className="verification-btn wip-btn" disabled>
                <FaCheckCircle /> Get Verified (Coming Soon)
              </button>
              <div className="verification-status">
                <span className="verification-badge unverified">
                  Unverified Account
                </span>
              </div>
            </div>
            <div className="form-help">Verification system coming soon!</div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="profile-btn-secondary"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="profile-btn-primary"
            >
              {saving ? (
                <>
                  <div className="spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit; 