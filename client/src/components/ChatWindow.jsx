import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane, FaUser, FaArrowLeft, FaEllipsisV, FaSmile, FaPaperclip, FaGift, FaEye, FaList, FaImage, FaTimes, FaCheck, FaCheckDouble, FaHandshake, FaBell } from 'react-icons/fa';
import { getAuthHeader, getCurrentUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ChatWindow = ({ selectedChat, onBack, setSelectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showWishSelector, setShowWishSelector] = useState(false);
  const [userWishes, setUserWishes] = useState([]);
  const [showGiftPromise, setShowGiftPromise] = useState(false);
  const [giftPromiseText, setGiftPromiseText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  // Simple emoji picker data
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
    '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀',
    '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽'
  ];

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      fetchUserWishes();
      markMessagesAsRead();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      
      // Make sure we have the other user's ID
      const otherUserId = selectedChat.otherUser?._id || selectedChat.otherUser;
      
      if (!otherUserId) {
        throw new Error('User information not available');
      }
      
      const response = await fetch(`/api/chat/${otherUserId}`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.chat.messages || []);
      
      // Update the selectedChat with the real chat data
      if (data.chat && data.chat._id !== selectedChat._id) {
        setSelectedChat(data.chat);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, setSelectedChat]);

  const fetchUserWishes = useCallback(async () => {
    try {
      // Make sure we have the other user's ID
      const otherUserId = selectedChat.otherUser?._id || selectedChat.otherUser;
      
      if (!otherUserId) {
        console.error('User ID not available for fetching wishes');
        return;
      }
      
      const response = await fetch(`/api/wishes/user/${otherUserId}`, {
        headers: getAuthHeader()
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserWishes(data.wishes || []);
      }
    } catch (err) {
      console.error('Failed to fetch user wishes:', err);
    }
  }, [selectedChat]);

  const markMessagesAsRead = useCallback(async () => {
    try {
      await fetch(`/api/chat/${selectedChat._id}/read`, {
        method: 'PUT',
        headers: getAuthHeader()
      });
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }, [selectedChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      
      // Prepare the request body
      const requestBody = {
        content: newMessage.trim()
      };
      
      // If we have a chat ID, use it; otherwise use otherUserId
      if (selectedChat._id && !selectedChat._id.startsWith('temp-')) {
        requestBody.chatId = selectedChat._id;
      } else {
        const otherUserId = selectedChat.otherUser?._id || selectedChat.otherUser;
        if (otherUserId) {
          requestBody.otherUserId = otherUserId;
        } else {
          throw new Error('User information not available');
        }
      }
      
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      setMessages(data.chat.messages || []);
      setNewMessage('');
      setShowEmojiPicker(false);
      
      // Update the selectedChat with the real chat data if it's new
      if (data.chat && data.chat._id !== selectedChat._id) {
        setSelectedChat(data.chat);
      }
      
      // Show notification for sent message
      showNotification('Message sent', 'Your message has been delivered');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const sendWishMessage = async (wish) => {
    try {
      setSending(true);
      const wishContent = `🎁 Wish: ${wish.title}\n${wish.description}\n💰 Price: $${wish.price}\n🔗 View: /wish/${wish._id}`;
      
      // Prepare the request body
      const requestBody = {
        content: wishContent
      };
      
      // If we have a chat ID, use it; otherwise use otherUserId
      if (selectedChat._id && !selectedChat._id.startsWith('temp-')) {
        requestBody.chatId = selectedChat._id;
      } else {
        const otherUserId = selectedChat.otherUser?._id || selectedChat.otherUser;
        if (otherUserId) {
          requestBody.otherUserId = otherUserId;
        } else {
          throw new Error('User information not available');
        }
      }
      
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send wish message');
      }
      
      const data = await response.json();
      setMessages(data.chat.messages || []);
      setShowWishSelector(false);
      
      // Update the selectedChat with the real chat data if it's new
      if (data.chat && data.chat._id !== selectedChat._id) {
        setSelectedChat(data.chat);
      }
      
      showNotification('Wish shared', `You shared ${wish.title} with ${selectedChat.otherUser.username}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const sendGiftPromise = async () => {
    if (!giftPromiseText.trim()) return;

    try {
      setSending(true);
      const promiseContent = `🤝 Gift Promise: ${giftPromiseText}\n\nI promise to get you this gift! 🎁`;
      
      // Prepare the request body
      const requestBody = {
        content: promiseContent
      };
      
      // If we have a chat ID, use it; otherwise use otherUserId
      if (selectedChat._id && !selectedChat._id.startsWith('temp-')) {
        requestBody.chatId = selectedChat._id;
      } else {
        const otherUserId = selectedChat.otherUser?._id || selectedChat.otherUser;
        if (otherUserId) {
          requestBody.otherUserId = otherUserId;
        } else {
          throw new Error('User information not available');
        }
      }
      
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send gift promise');
      }
      
      const data = await response.json();
      setMessages(data.chat.messages || []);
      setShowGiftPromise(false);
      setGiftPromiseText('');
      
      // Update the selectedChat with the real chat data if it's new
      if (data.chat && data.chat._id !== selectedChat._id) {
        setSelectedChat(data.chat);
      }
      
      showNotification('Gift promise sent', `You made a gift promise to ${selectedChat.otherUser.username}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setSending(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader().Authorization
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      const imageContent = `📎 Image: ${data.imageUrl}`;

      // Prepare the request body
      const requestBody = {
        content: imageContent
      };
      
      // If we have a chat ID, use it; otherwise use otherUserId
      if (selectedChat._id && !selectedChat._id.startsWith('temp-')) {
        requestBody.chatId = selectedChat._id;
      } else {
        const otherUserId = selectedChat.otherUser?._id || selectedChat.otherUser;
        if (otherUserId) {
          requestBody.otherUserId = otherUserId;
        } else {
          throw new Error('User information not available');
        }
      }
      
      const messageResponse = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send image message');
      }

      const messageData = await messageResponse.json();
      setMessages(messageData.chat.messages || []);
      setShowAttachmentMenu(false);
      
      // Update the selectedChat with the real chat data if it's new
      if (messageData.chat && messageData.chat._id !== selectedChat._id) {
        setSelectedChat(messageData.chat);
      }
      
      showNotification('Image sent', 'Your image has been shared');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const showNotification = (title, body) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo192.png' });
    }
    
    // In-app notification
    const notification = {
      id: Date.now(),
      title,
      body,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isOwnMessage = (message) => {
    return message.sender._id === currentUser.id;
  };

  const getReadStatus = (message) => {
    if (!isOwnMessage(message)) return null;
    
    if (message.read) {
      return <FaCheckDouble className="read-status read" />;
    } else if (message.delivered) {
      return <FaCheckDouble className="read-status delivered" />;
    } else {
      return <FaCheck className="read-status sent" />;
    }
  };

  const handleViewProfile = () => {
    navigate(`/user/${selectedChat.otherUser.username}`);
  };

  const handleViewWishlist = () => {
    navigate(`/user/${selectedChat.otherUser.username}`);
  };

  if (!selectedChat) {
    return (
      <div className="chat-window-empty">
        <div className="empty-state">
          <h3>Select a conversation</h3>
          <p>Choose a chat from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Enhanced Chat Header */}
      <div className="chat-header">
        <button onClick={onBack} className="back-btn">
          <FaArrowLeft />
        </button>
        
        <div className="chat-user-info">
          <div className="user-avatar">
            {selectedChat.otherUser?.profileImage ? (
              <img 
                src={`http://localhost:5000${selectedChat.otherUser.profileImage}`}
                alt={selectedChat.otherUser.username || 'User'}
                className="avatar-img"
              />
            ) : (
              <div className="avatar-placeholder">
                {selectedChat.otherUser?.username ? (
                  selectedChat.otherUser.username.charAt(0).toUpperCase()
                ) : (
                  <FaUser />
                )}
              </div>
            )}
          </div>
          <div className="user-details">
            <h3>{selectedChat.otherUser?.username || 'Loading...'}</h3>
            <span className="user-status">Online</span>
          </div>
        </div>
        
        <div className="chat-header-actions">
          <button onClick={handleViewProfile} className="header-action-btn" title="View Profile">
            <FaEye />
          </button>
          <button onClick={handleViewWishlist} className="header-action-btn" title="View Wishlist">
            <FaList />
          </button>
          <button 
            onClick={() => setShowGiftPromise(true)} 
            className="header-action-btn gift-promise-btn" 
            title="Make a Gift Promise"
          >
            <FaHandshake />
          </button>
          <button className="menu-btn">
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {loading ? (
          <div className="messages-loading">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p>Loading messages...</p>
          </div>
        ) : error ? (
          <div className="messages-error">
            <p>Error: {error}</p>
            <button onClick={fetchMessages} className="retry-btn">
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="messages-empty">
            <h3>No messages yet</h3>
            <p>Start the conversation by sending a message!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
                <div
                  key={message._id || index}
                  className={`message ${isOwnMessage(message) ? 'own' : 'other'}`}
                >
                <div className="message-content">
                  <p>{message.content}</p>
                  <div className="message-footer">
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                    {getReadStatus(message)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Enhanced Message Input */}
      <form onSubmit={sendMessage} className="message-input-container">
        <div className="message-input-wrapper">
          {/* Attachment Menu */}
          <div className="attachment-menu">
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="attachment-btn"
              title="Attachments"
            >
              <FaPaperclip />
            </button>
            
            {showAttachmentMenu && (
              <div className="attachment-dropdown">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="attachment-option"
                >
                  <FaImage />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowWishSelector(!showWishSelector)}
                  className="attachment-option"
                >
                  <FaGift />
                  <span>Send a Wish</span>
                </button>
              </div>
            )}
          </div>

          {/* Emoji Picker */}
          <div className="emoji-picker-container">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="emoji-btn"
              title="Emoji"
            >
              <FaSmile />
            </button>
            
            {showEmojiPicker && (
              <div className="emoji-picker">
                <div className="emoji-grid">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="emoji-item"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            disabled={sending}
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="send-btn"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Wish Selector */}
        {showWishSelector && (
          <div className="wish-selector">
            <div className="wish-selector-header">
              <h4>Send a Wish</h4>
              <button
                type="button"
                onClick={() => setShowWishSelector(false)}
                className="close-btn"
              >
                <FaTimes />
              </button>
            </div>
            <div className="wish-list">
              {userWishes.length === 0 ? (
                <p className="no-wishes">No wishes found for this user</p>
              ) : (
                userWishes.map(wish => (
                  <div key={wish._id} className="wish-item">
                    <div className="wish-info">
                      <h5>{wish.title}</h5>
                      <p>{wish.description}</p>
                      <span className="wish-price">${wish.price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => sendWishMessage(wish)}
                      className="send-wish-btn"
                      disabled={sending}
                    >
                      Send
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Gift Promise Modal */}
        {showGiftPromise && (
          <div className="gift-promise-modal">
            <div className="gift-promise-content">
              <div className="gift-promise-header">
                <h4>🤝 Make a Gift Promise</h4>
                <button
                  type="button"
                  onClick={() => setShowGiftPromise(false)}
                  className="close-btn"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="gift-promise-body">
                <p>Promise to get a gift for {selectedChat.otherUser.username}:</p>
                <textarea
                  value={giftPromiseText}
                  onChange={(e) => setGiftPromiseText(e.target.value)}
                  placeholder="Describe what you promise to get them..."
                  className="gift-promise-input"
                  rows={3}
                />
                <div className="gift-promise-actions">
                  <button
                    type="button"
                    onClick={() => setShowGiftPromise(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={sendGiftPromise}
                    className="promise-btn"
                    disabled={!giftPromiseText.trim() || sending}
                  >
                    {sending ? 'Sending...' : 'Make Promise'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className="notification">
            <FaBell className="notification-icon" />
            <div className="notification-content">
              <h5>{notification.title}</h5>
              <p>{notification.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow; 