import React from 'react';
import { FaCrown, FaFire, FaChartLine } from 'react-icons/fa';
import '../App.css';

const leaderboardData = [
  {
    name: 'Alice',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    score: 2000,
    badge: 'champ',
    country: '🇺🇸',
    isCurrent: false,
  },
  {
    name: 'Bob',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    score: 1700,
    badge: 'streak',
    country: '🇬🇧',
    isCurrent: true, // Simulate current user
  },
  {
    name: 'Charlie',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    score: 1500,
    badge: 'climber',
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

function getBadgeIcon(badge) {
  if (badge === 'champ') return <FaCrown style={{ color: '#fbbf24', marginRight: 6, verticalAlign: 'middle' }} title="Reigning Champ" />;
  if (badge === 'streak') return <FaFire style={{ color: '#f87171', marginRight: 6, verticalAlign: 'middle' }} title="Streak x5" />;
  if (badge === 'climber') return <FaChartLine style={{ color: '#2563eb', marginRight: 6, verticalAlign: 'middle' }} title="Fastest Climber" />;
  return null;
}

function getBadgeText(badge) {
  if (badge === 'champ') return 'Reigning Champ';
  if (badge === 'streak') return 'Streak x5';
  if (badge === 'climber') return 'Fastest Climber';
  return '';
}

const Leaderboard = () => {
  return (
    <div className="leaderboard-root leaderboard-thin-root">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="leaderboard-list leaderboard-thin-list">
        {leaderboardData.map((user, idx) => (
          <div
            key={user.name}
            className={`leaderboard-card leaderboard-thin-card ${idx < 3 ? medalBg[idx] : ''} ${user.isCurrent ? 'leaderboard-current' : ''}`}
            style={{ paddingLeft: '32px', paddingRight: '32px', marginLeft: '12px', marginRight: '12px' }}
          >
            <div className="leaderboard-thin-left">
              <span className="leaderboard-rank leaderboard-thin-rank">{idx + 1}</span>
              <img src={user.avatar} alt={user.name} className="leaderboard-avatar leaderboard-thin-avatar" />
            </div>
            <div className="leaderboard-thin-info">
              <span className="leaderboard-name">{user.name} <span className="leaderboard-country">{user.country}</span></span>
              <span className="leaderboard-score">{user.score} pts</span>
              {user.badge && (
                <span className="leaderboard-badge">
                  {getBadgeIcon(user.badge)}{getBadgeText(user.badge)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
