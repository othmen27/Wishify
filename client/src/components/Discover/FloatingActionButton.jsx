import React from 'react';
import { FaPlus } from 'react-icons/fa';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  return (
    <button className="discover-fab" onClick={() => navigate('/create')}>
      <FaPlus /> Create Wishlist
    </button>
  );
};

export default FloatingActionButton; 