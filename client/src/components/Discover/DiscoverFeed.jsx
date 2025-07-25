import React from 'react';
import WishlistCard from './WishlistCard';
import '../../App.css';

const mockWishlists = [
  {
    id: 1,
    user: { name: 'Jane Doe', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', bio: 'Dreaming of a new laptop!' },
    date: '2025-07-20',
    quote: 'Hoping to get a PS5 this year!',
    items: ['PS5', 'Wireless Headset', 'Extra Controller'],
    likes: 12,
    shares: 3,
    views: 120,
    tags: ['Public', 'Verified'],
  },
  {
    id: 2,
    user: { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', bio: 'Book lover and aspiring author.' },
    date: '2025-07-18',
    quote: 'A Kindle would change my life!',
    items: ['Kindle', 'Book Light'],
    likes: 8,
    shares: 2,
    views: 80,
    tags: ['Public'],
  },
];

const DiscoverFeed = () => (
  <div className="discover-feed">
    {mockWishlists.map(wish => (
      <WishlistCard key={wish.id} wishlist={wish} />
    ))}
  </div>
);

export default DiscoverFeed; 