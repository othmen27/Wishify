import React
import config from './config';
import { useState, useEffect } from 'react';
import { FaCrown, FaFire, FaChartLine } from 'react-icons/fa';
import '../App.css';

const medalBg = [
  'leaderboard-gold',
  'leaderboard-silver',
  'leaderboard-bronze',
];

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  const handleImageError = (userId) => {
    setFailedImages(prev => new Set(prev).add(userId));
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch('${config.getApiUrl()}/api/auth/leaderboard');
        if (response.ok) {
          const data = await response.json();
          console.log('Leaderboard data:', data);
          
          // Transform the data to match our component structure
          const transformedData = (data.users || []).map((user, index) => ({
            name: user.username || 'Anonymous',
            avatar: user.profileImage || null,
            score: user.points || 0,
            badge: index === 0 ? 'champ' : index === 1 ? 'streak' : index === 2 ? 'climber' : '',
            country: '🇺🇸', // Default for now
            isCurrent: false, // We'll need to get current user info to set this
            _id: user._id || `user-${index}`
          }));
          
          setLeaderboardData(transformedData);
        } else {
          console.error('Failed to fetch leaderboard:', response.status, response.statusText);
          setError('Failed to load leaderboard');
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="leaderboard-root leaderboard-thin-root">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <div className="leaderboard-loading">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-root leaderboard-thin-root">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <div className="leaderboard-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-root leaderboard-thin-root">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="leaderboard-list leaderboard-thin-list">
        {leaderboardData.map((user, idx) => (
          <div
            key={user._id || user.name}
            className={`leaderboard-card leaderboard-thin-card ${idx < 3 ? medalBg[idx] : ''} ${user.isCurrent ? 'leaderboard-current' : ''}`}
            style={{ paddingLeft: '32px', paddingRight: '32px', marginLeft: '12px', marginRight: '12px' }}
          >
            <div className="leaderboard-thin-left">
              <span className="leaderboard-rank leaderboard-thin-rank">{idx + 1}</span>
              {user.avatar && !failedImages.has(user._id) ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="leaderboard-avatar leaderboard-thin-avatar"
                  onError={() => handleImageError(user._id)}
                />
              ) : (
                <div className="leaderboard-avatar leaderboard-thin-avatar leaderboard-avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="leaderboard-thin-info">
              <span className="leaderboard-name">{user.name} <span className="leaderboard-country">{user.country}</span></span>
              <span className="leaderboard-score">{user.score} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
