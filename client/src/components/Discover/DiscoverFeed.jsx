import React, { useState, useEffect } from 'react';
import WishlistCard from './WishlistCard';
import '../../App.css';
import { getPublicWishes } from '../../utils/auth';

const DiscoverFeed = ({ filters }) => {
  const [wishes, setWishes] = useState([]);
  const [filteredWishes, setFilteredWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        setLoading(true);
        const publicWishes = await getPublicWishes();
        setWishes(publicWishes);
      } catch (err) {
        setError('Failed to load wishes');
        console.error('Error fetching wishes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishes();
  }, []);

  // Apply category filter
  useEffect(() => {
    let filtered = [...wishes];

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      if (filters.category === 'more') {
        // "More" shows "other" category wishes
        filtered = filtered.filter(wish => wish.category === 'other');
      } else {
        filtered = filtered.filter(wish => wish.category === filters.category);
      }
    }

    // Always sort by most recent
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredWishes(filtered);
  }, [wishes, filters.category]);

  if (loading) {
    return (
      <div className="discover-feed">
        <div className="loading">Loading wishes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discover-feed">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (filteredWishes.length === 0) {
    return (
      <div className="discover-feed">
        <div className="no-wishes">
          {wishes.length === 0 
            ? 'No public wishes found. Be the first to share your wishes!'
            : 'No wishes match your current filter. Try selecting a different category.'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="discover-feed">
      {filteredWishes.map(wish => (
        <WishlistCard key={wish._id} wishlist={wish} />
      ))}
    </div>
  );
};

export default DiscoverFeed; 