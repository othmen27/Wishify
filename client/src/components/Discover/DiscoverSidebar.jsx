import React from 'react';
import Leaderboard from '../Leaderboard';
import '../../App.css';

const DiscoverSidebar = () => (
  <div className="discover-sidebar">
    <Leaderboard />
    <div className="discover-filters">
      <h3>Filters</h3>
      <div>
        <label>Category:</label>
        <select><option>All</option><option>Tech</option><option>Books</option><option>Fashion</option></select>
      </div>
      <div>
        <label>Region:</label>
        <select><option>All</option><option>US</option><option>UK</option><option>CA</option></select>
      </div>
      <div>
        <label>Sort by:</label>
        <select><option>Most Recent</option><option>Most Popular</option></select>
      </div>
    </div>
  </div>
);

export default DiscoverSidebar; 