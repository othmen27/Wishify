import React from 'react';
import DiscoverPage from './components/Discover/DiscoverPage';
import usePageTitle from './hooks/usePageTitle';

const Discover = () => {
  usePageTitle('Discover');
  return <DiscoverPage />;
};

export default Discover;
