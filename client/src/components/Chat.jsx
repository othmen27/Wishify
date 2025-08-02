import React, { useState, useEffect } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import { isLoggedIn } from '../utils/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import usePageTitle from '../hooks/usePageTitle';
import '../App.css';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  usePageTitle('Chat');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle user parameter from URL (for contextual chat access)
  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam) {
      // Find or create chat with the specified user
      handleChatWithUser(userParam);
    }
  }, [searchParams]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setShowChatList(true);
  };



  const handleChatWithUser = async (username) => {
    try {
      // First, try to find existing chat with this user
      const response = await fetch('/api/chat', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const existingChat = data.chats.find(chat => 
          chat.otherUser.username === username
        );
        
        if (existingChat) {
          setSelectedChat(existingChat);
          setShowChatList(false);
          return;
        }
      }
      
      // If no existing chat, create a new one by sending a message
      const userResponse = await fetch(`/api/users/${username}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        
        // Create a chat by sending an initial message
        const createChatResponse = await fetch('/api/chat/message', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            otherUserId: userData.user._id,
            content: '👋 Hi! I wanted to chat with you about your wishes.'
          })
        });
        
        if (createChatResponse.ok) {
          const chatData = await createChatResponse.json();
          setSelectedChat(chatData.chat);
          setShowChatList(false);
        } else {
          console.error('Failed to create chat');
        }
      }
    } catch (error) {
      console.error('Error finding/creating chat with user:', error);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Mobile Header */}
        <div className="chat-mobile-header">
          {!showChatList && (
            <button onClick={handleBackToList} className="mobile-back-btn">
              <FaTimes />
            </button>
          )}
          <h1>Messages</h1>
          <FaComments className="header-icon" />
        </div>

        {/* Desktop Layout */}
        <div className="chat-layout">
          {/* Chat List Sidebar */}
          <div className={`chat-sidebar ${showChatList ? 'show' : 'hide'}`}>
            <ChatList 
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChat?._id}
            />
          </div>

          {/* Chat Window */}
          <div className={`chat-main ${!showChatList ? 'show' : 'hide'}`}>
            <ChatWindow 
              selectedChat={selectedChat}
              onBack={handleBackToList}
              setSelectedChat={setSelectedChat}
            />
          </div>

          {/* Mobile Overlay */}
          {!showChatList && (
            <div className="chat-mobile-overlay">
              <ChatWindow 
                selectedChat={selectedChat}
                onBack={handleBackToList}
                setSelectedChat={setSelectedChat}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 