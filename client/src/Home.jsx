import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHandHoldingHeart } from 'react-icons/fa';
import './App.css';

const Home = () => {
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/wishes')
      .then(res => setWishes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">All Wishes</h1>
      {wishes.length === 0 ? (
        <p className="text-center">No wishes yet. Be the first to post one!</p>
      ) : (
        wishes.map(wish => (
          <div key={wish._id} style={{
            background: '#f1f5fe',
            borderRadius: '12px',
            boxShadow: '0 1px 6px rgba(37,99,235,0.06)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{marginBottom: 8, color: '#2563eb'}}>{wish.title}</h3>
              <p style={{marginBottom: 0}}>{wish.description}</p>
            </div>
            <button style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <FaHandHoldingHeart /> Donate
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
