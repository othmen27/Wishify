import React from 'react';
import config from './config';
import { useState } from 'react';
import { FaGift, FaLink, FaImage, FaEye, FaEyeSlash, FaPlus, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from './utils/auth';
import ImageDropZone from './components/ImageDropZone';
import './App.css';

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    category: '',
    priority: 'medium',
    visibility: 'private'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);

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

  const handleImagesChange = (images) => {
    setUploadedImages(images);
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async () => {
    if (uploadedImages.length === 0) return [];

    const formData = new FormData();
    uploadedImages.forEach((image, index) => {
      formData.append('images', image.file);
    });

    try {
      const response = await axios.post(
        `${config.getApiUrl()}/api/upload/images`,
        formData,
        { 
          headers: { 
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      return response.data.imageUrls || [];
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Upload images first if any
      let imageUrls = [];
      if (uploadedImages.length > 0) {
        imageUrls = await uploadImages();
      }

      // Create wish with uploaded image URLs
      const wishData = {
        ...formData,
        imageUrls: imageUrls
      };
      
      console.log('Sending wish data:', wishData);
      
      const response = await axios.post(
        `${config.getApiUrl()}/api/wishes`,
        wishData,
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

          {/* Images */}
          <div className="form-group">
            <label className="form-label">
              <FaImage className="form-label-icon" />
              Images
            </label>
            <ImageDropZone 
              onImagesChange={handleImagesChange}
              maxImages={4}
            />
            <div className="form-help">Upload up to 4 images to showcase your wish</div>
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
