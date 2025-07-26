import React from 'react';
import DiscoverTopBar from './DiscoverTopBar';
import DiscoverSidebar from './DiscoverSidebar';
import DiscoverFeed from './DiscoverFeed';
import FloatingActionButton from './FloatingActionButton';
import '../../App.css';
import { isLoggedIn, getCurrentUser,getWishes } from '../../utils/auth';
const DiscoverPage = () => {
  return (
    <div className="discover-root">
      <DiscoverTopBar />
      <div className="discover-main-layout">
        <div className="discover-feed-area">
          <DiscoverFeed />
        </div>
        <aside className="discover-sidebar-area">
          <DiscoverSidebar />
        </aside>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default DiscoverPage; 