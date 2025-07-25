import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../../App.css';

const DiscoverTopBar = () => (
  <div className="discover-topbar">
    <div className="discover-search">
      <FaSearch style={{ marginRight: 8, color: '#2563eb' }} />
      <input type="text" placeholder="Search wishlists..." className="discover-search-input" />
    </div>
    <select className="discover-sort-dropdown">
      <option>Trending</option>
      <option>Newest</option>
      <option>Fulfilled</option>
    </select>
    <div className="discover-categories">
      <button className="discover-category-btn">Tech</button>
      <button className="discover-category-btn">Books</button>
      <button className="discover-category-btn">Fashion</button>
      <button className="discover-category-btn">More...</button>
    </div>
  </div>
);

export default DiscoverTopBar; 