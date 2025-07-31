import React from 'react';
import '../../App.css';

const DiscoverSidebar = ({ filters, onFilterChange }) => {
  const categories = [
    { id: 'tech', label: 'Tech' },
    { id: 'books', label: 'Books' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'more', label: 'More...' }
  ];

  const handleCategoryClick = (categoryId) => {
    onFilterChange('category', categoryId);
  };

  return (
    <div className="discover-sidebar">
      {/* Search Bar */}
      <div className="discover-search-section">
        <input 
          type="text" 
          placeholder="Search wishlists..." 
          className="discover-search-input"
        />
      </div>

      {/* Trending Header */}
      <div className="discover-trending-header">
        <span className="discover-trending-title">Trending</span>
        <span className="discover-trending-arrow">▼</span>
      </div>

      {/* Category Buttons */}
      <div className="discover-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`discover-category-btn ${
              filters.category === category.id ? 'discover-category-btn-active' : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiscoverSidebar; 