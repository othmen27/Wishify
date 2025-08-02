import React, { useState, useEffect, useCallback } from 'react';
import { FaComments, FaCircle, FaUser, FaSearch, FaFilter, FaClock, FaGift } from 'react-icons/fa';
import { getAuthHeader, getCurrentUser } from '../utils/auth';
import '../App.css';

const ChatList = ({ onChatSelect, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    filterChats();
  }, [chats, searchTerm, activeFilter]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat', {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      
      const data = await response.json();
      setChats(data.chats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterChats = useCallback(() => {
    let filtered = [...chats];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(chat => 
        chat.otherUser?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filters
    switch (activeFilter) {
      case 'recent':
        filtered = filtered.filter(chat => {
          if (!chat.lastMessageTime) return false;
          const lastMessageDate = new Date(chat.lastMessageTime);
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return lastMessageDate > oneWeekAgo;
        });
        break;
      case 'unread':
        filtered = filtered.filter(chat => chat.unreadCount > 0);
        break;
      case 'wish-interactions':
        // This would need backend support to track wish-related chats
        // For now, we'll show chats with gift-related keywords
        filtered = filtered.filter(chat => 
          chat.lastMessage?.content?.toLowerCase().includes('gift') ||
          chat.lastMessage?.content?.toLowerCase().includes('wish') ||
          chat.lastMessage?.content?.toLowerCase().includes('buy') ||
          chat.lastMessage?.content?.toLowerCase().includes('send')
        );
        break;
      default:
        break;
    }

    setFilteredChats(filtered);
  }, [chats, searchTerm, activeFilter]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return '';
    return message.length > maxLength 
      ? message.substring(0, maxLength) + '...' 
      : message;
  };

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case 'recent': return <FaClock />;
      case 'unread': return <FaCircle />;
      case 'wish-interactions': return <FaGift />;
      default: return <FaFilter />;
    }
  };

  const getFilterLabel = (filterType) => {
    switch (filterType) {
      case 'recent': return 'Recent';
      case 'unread': return 'Unread';
      case 'wish-interactions': return 'Wish Interactions';
      default: return 'All';
    }
  };

  if (loading) {
    return (
      <div className="chat-list-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p>Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list-error">
        <p>Error loading chats: {error}</p>
        <button onClick={fetchChats} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Messages</h2>
        <FaComments className="header-icon" />
      </div>

      {/* Search Bar */}
      <div className="chat-search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="chat-search-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="chat-filters">
        <div className="filter-tabs">
          {['all', 'recent', 'unread', 'wish-interactions'].map(filterType => (
            <button
              key={filterType}
              className={`filter-tab ${activeFilter === filterType ? 'active' : ''}`}
              onClick={() => setActiveFilter(filterType)}
            >
              {getFilterIcon(filterType)}
              <span>{getFilterLabel(filterType)}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="chat-list-content">
        {filteredChats.length === 0 ? (
          <div className="chat-list-empty">
            <FaComments className="empty-icon" />
            <h3>No conversations found</h3>
            <p>
              {searchTerm 
                ? `No chats match "${searchTerm}"`
                : activeFilter !== 'all' 
                  ? `No ${getFilterLabel(activeFilter).toLowerCase()} conversations`
                  : 'Start chatting with other users to see your conversations here.'
              }
            </p>
          </div>
        ) : (
          filteredChats.map(chat => {
            const isSelected = selectedChatId === chat._id;
            const isUnread = chat.unreadCount > 0;
            
            return (
              <div
                key={chat._id}
                className={`chat-item ${isSelected ? 'selected' : ''} ${isUnread ? 'unread' : ''}`}
                onClick={() => onChatSelect(chat)}
              >
                <div className="chat-avatar">
                  {chat.otherUser?.profileImage ? (
                    <img 
                      src={`http://localhost:5000${chat.otherUser.profileImage}`}
                      alt={chat.otherUser.username}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <FaUser />
                    </div>
                  )}
                  {isUnread && (
                    <div className="unread-indicator">
                      <FaCircle />
                    </div>
                  )}
                </div>
                
                <div className="chat-info">
                  <div className="chat-header">
                    <h3 className="chat-name">{chat.otherUser?.username}</h3>
                    {chat.lastMessageTime && (
                      <span className="chat-time">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  
                  <div className="chat-preview">
                    {chat.lastMessage ? (
                      <p className="last-message">
                        {chat.lastMessage.sender._id === currentUser._id && (
                          <span className="message-prefix">You: </span>
                        )}
                        {truncateMessage(chat.lastMessage.content)}
                      </p>
                    ) : (
                      <p className="no-messages">No messages yet</p>
                    )}
                    
                    {isUnread && (
                      <span className="unread-count">{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList; 