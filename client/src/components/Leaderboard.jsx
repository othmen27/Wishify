import React from 'react';
import '../App.css';

const leaderboardData = [
  {
    name: 'Alice',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    score: 2000,
    badge: '👑 Reigning Champ',
    country: '🇺🇸',
    isCurrent: false,
  },
  {
    name: 'Bob',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    score: 1700,
    badge: '🔥 Streak x5',
    country: '🇬🇧',
    isCurrent: true, // Simulate current user
  },
  {
    name: 'Charlie',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    score: 1500,
    badge: '📈 Fastest Climber',
    country: '🇨🇦',
    isCurrent: false,
  },
  {
    name: 'Diana',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    score: 1200,
    badge: '',
    country: '🇩🇪',
    isCurrent: false,
  },
  {
    name: 'Eve',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    score: 900,
    badge: '',
    country: '🇫🇷',
    isCurrent: false,
  },
];

const medalBg = [
  'leaderboard-gold',
  'leaderboard-silver',
  'leaderboard-bronze',
];

const Leaderboard = () => {
  return (
    <div className="leaderboard-root leaderboard-thin-root">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="leaderboard-list leaderboard-thin-list">
        {leaderboardData.map((user, idx) => (
          <div
            key={user.name}
            className={`leaderboard-card leaderboard-thin-card ${idx < 3 ? medalBg[idx] : ''} ${user.isCurrent ? 'leaderboard-current' : ''}`}
          >
            <div className="leaderboard-thin-left">
              <span className="leaderboard-rank leaderboard-thin-rank">{idx + 1}</span>
              <img src={user.avatar} alt={user.name} className="leaderboard-avatar leaderboard-thin-avatar" />
            </div>
            <div className="leaderboard-thin-info">
              <span className="leaderboard-name">{user.name} <span className="leaderboard-country">{user.country}</span></span>
              <span className="leaderboard-score">{user.score} pts</span>
              {user.badge && <span className="leaderboard-badge">{user.badge}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
