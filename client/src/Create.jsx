import React, { useState } from 'react';
import { FaGift, FaLink, FaImage, FaEye, FaEyeSlash, FaPlus, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from './utils/auth';
import './App.css';

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    imageUrl: '',
    category: '',
    priority: 'medium',
    visibility: 'private'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const categories = [
    { value: 'gaming', label: '🎮 Gaming', color: '#8b5cf6' },
    { value: 'fashion', label: '👕 Fashion', color: '#ec4899' },
    { value: 'books', label: '📚 Books', color: '#f59e0b' },
    { value: 'travel', label: '🧳 Travel', color: '#10b981' },
    { value: 'tech', label: '🎧 Tech', color: '#3b82f6' },
    { value: 'home', label: '🏠 Home & Garden', color: '#84cc16' },
    { value: 'sports', label: '⚽ Sports', color: '#ef4444' },
    { value: 'beauty', label: '💄 Beauty', color: '#f97316' },
    { value: 'food', label: '🍕 Food & Dining', color: '#06b6d4' },
    { value: 'other', label: '🎁 Other', color: '#6b7280' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    if (url && isValidUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    // Debug: Log the data being sent
    console.log('Sending wish data:', formData);
    console.log('Auth headers:', getAuthHeader());
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/wishes',
        formData,
        { headers: getAuthHeader() }
      );
      
      console.log('Wish created successfully:', response.data);
      navigate('/wishlist'); // Redirect to wishlist after creation
    } catch (error) {
      console.error('Error creating wish:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      setErrors({ submit: error.response?.data?.message || 'Failed to create wish. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title.trim() && !loading;

  return (
    <div className="create-wish-container">
      <div className="create-wish-card">
        {/* Header */}
        <div className="create-wish-header">
          <h1 className="create-wish-title">
            <FaGift className="create-wish-icon" />
            Add a New Wish ✨
          </h1>
          <p className="create-wish-subtitle">
            Dream it. Describe it. Make it happen.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="create-wish-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Wish Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="PlayStation 5 or Trip to Japan"
              className={`form-input ${errors.title ? 'error' : ''}`}
              maxLength={100}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell us more about your wish... (optional)"
              className="form-textarea"
              rows={4}
              maxLength={500}
            />
            <div className="form-help">Use this to describe details or personalization</div>
          </div>

          {/* Link */}
          <div className="form-group">
            <label className="form-label">
              <FaLink className="form-label-icon" />
              Link / URL
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="https://amazon.com/..."
              className={`form-input ${errors.link ? 'error' : ''}`}
            />
            {errors.link && <div className="form-error">{errors.link}</div>}
            <div className="form-help">Optional, but helps others find exactly what you want</div>
          </div>

          {/* Image */}
          <div className="form-group">
            <label className="form-label">
              <FaImage className="form-label-icon" />
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`form-input ${errors.imageUrl ? 'error' : ''}`}
            />
            {errors.imageUrl && <div className="form-error">{errors.imageUrl}</div>}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" onError={() => setImagePreview('')} />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-grid">
              {categories.map(category => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleInputChange('category', category.value)}
                  className={`category-pill ${formData.category === category.value ? 'selected' : ''}`}
                  style={{ '--category-color': category.color }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-buttons">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleInputChange('priority', priority.value)}
                  className={`priority-btn ${formData.priority === priority.value ? 'selected' : ''}`}
                  style={{ '--priority-color': priority.color }}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <div className="visibility-toggle">
              <button
                type="button"
                onClick={() => handleInputChange('visibility', 'private')}
                className={`visibility-btn ${formData.visibility === 'private' ? 'selected' : ''}`}
              >
                <FaEyeSlash />
                Private
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('visibility', 'public')}
                className={`visibility-btn ${formData.visibility === 'public' ? 'selected' : ''}`}
              >
                <FaEye />
                Public
              </button>
            </div>
            <div className="form-help">
              {formData.visibility === 'public' 
                ? 'Public wishes can appear in the Discover feed' 
                : 'Private wishes are only visible to you'
              }
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="form-error submit-error">{errors.submit}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="submit-btn"
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Adding to Wishlist...
              </>
            ) : (
              <>
                <FaPlus />
                Add to Wishlist
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
