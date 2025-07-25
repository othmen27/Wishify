import React from 'react';
import { FaHeart, FaShareAlt, FaEye } from 'react-icons/fa';
import '../../App.css';

const WishlistCard = ({ wishlist }) => (
  <div className="wishlist-card">
    <div className="wishlist-card-header">
      <img src={wishlist.user.avatar} alt={wishlist.user.name} className="wishlist-card-avatar" />
      <div className="wishlist-card-userinfo">
        <div className="wishlist-card-username">{wishlist.user.name}</div>
        <div className="wishlist-card-date">{wishlist.date}</div>
        <div className="wishlist-card-bio">{wishlist.user.bio}</div>
      </div>
    </div>
    <div className="wishlist-card-quote">“{wishlist.quote}”</div>
    <div className="wishlist-card-items">
      {wishlist.items.slice(0, 3).map((item, idx) => (
        <span key={idx} className="wishlist-card-item">🎁 {item}</span>
      ))}
    </div>
    <div className="wishlist-card-tags">
      {wishlist.tags.map(tag => (
        <span key={tag} className={`wishlist-card-tag wishlist-card-tag-${tag.toLowerCase()}`}>{tag}</span>
      ))}
    </div>
    <div className="wishlist-card-actions">
      <button className="wishlist-card-action"><FaHeart /> {wishlist.likes}</button>
      <button className="wishlist-card-action"><FaShareAlt /> {wishlist.shares}</button>
      <button className="wishlist-card-action"><FaEye /> {wishlist.views}</button>
      <button className="wishlist-card-action">View Full</button>
    </div>
  </div>
);

export default WishlistCard; 