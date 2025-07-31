import React, { useState } from 'react';
import DiscoverTopBar from './DiscoverTopBar';
import DiscoverFeed from './DiscoverFeed';
import FloatingActionButton from './FloatingActionButton';
import '../../App.css';
import { isLoggedIn, getCurrentUser, getWishes } from '../../utils/auth';

const DiscoverPage = () => {
  const [filters, setFilters] = useState({
    category: 'All'
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="discover-root">
      <DiscoverTopBar />
      <div className="discover-main-layout">
        <div className="discover-feed-area">
          <DiscoverFeed filters={filters} />
        </div>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default DiscoverPage; 