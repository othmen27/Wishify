import React, { useState, useEffect } from 'react';
import WishlistCard from './WishlistCard';
import '../../App.css';
import { getPublicWishes } from '../../utils/auth';

const DiscoverFeed = () => {
  const [wishes, setWishes] = useState([]);
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

  if (wishes.length === 0) {
    return (
      <div className="discover-feed">
        <div className="no-wishes">No public wishes found. Be the first to share your wishes!</div>
      </div>
    );
  }

  return (
    <div className="discover-feed">
      {wishes.map(wish => (
        <WishlistCard key={wish._id} wishlist={wish} />
      ))}
    </div>
  );
};

export default DiscoverFeed; 