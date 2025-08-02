const Chat = require('../models/Chat');
const User = require('../models/User');

// Get all chats for current user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'username profileImage')
    .populate('messages.sender', 'username profileImage')
    .sort({ lastMessage: -1 });

    console.log('Found chats for user:', userId, 'Count:', chats.length);
    chats.forEach(chat => {
      console.log('Chat ID:', chat._id, 'Participants:', chat.participants.map(p => p.username), 'Last Message:', chat.lastMessage, 'Messages count:', chat.messages.length);
    });

    // Format chats for frontend
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId.toString()
      );
      
      const unreadCount = chat.unreadCount.get(userId.toString()) || 0;
      
      return {
        _id: chat._id,
        otherUser: otherParticipant,
        lastMessage: chat.messages[chat.messages.length - 1] || null,
        unreadCount,
        lastMessageTime: chat.lastMessage
      };
    });

    res.json({ chats: formattedChats });
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get specific chat between two users
exports.getChat = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get or create chat
    let chat = await Chat.getChatBetweenUsers(currentUserId, otherUserId);
    
    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [currentUserId, otherUserId],
        messages: []
      });
      await chat.save();
    }
    
    // Mark messages as read
    await chat.markAsRead(currentUserId);
    
    // Get populated chat
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'username profileImage')
      .populate('messages.sender', 'username profileImage');

    // Format chat for frontend (same format as getUserChats)
    const otherParticipant = populatedChat.participants.find(
      p => p._id.toString() !== currentUserId.toString()
    );
    
    const unreadCount = populatedChat.unreadCount.get(currentUserId.toString()) || 0;
    
    const formattedChat = {
      _id: populatedChat._id,
      otherUser: otherParticipant,
      messages: populatedChat.messages,
      lastMessage: populatedChat.messages[populatedChat.messages.length - 1] || null,
      unreadCount,
      lastMessageTime: populatedChat.lastMessage
    };

    res.json({ chat: formattedChat });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, otherUserId, content } = req.body;
    const senderId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    let chat;

    if (chatId) {
      // Use existing chat
      chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      // Verify user is participant
      if (!chat.participants.includes(senderId)) {
        return res.status(403).json({ message: 'Not authorized to send message in this chat' });
      }
    } else if (otherUserId) {
      // Get or create chat with other user
      chat = await Chat.getChatBetweenUsers(senderId, otherUserId);
      
      if (!chat) {
        // Create new chat
        console.log('Creating new chat between users:', senderId, otherUserId);
        chat = new Chat({
          participants: [senderId, otherUserId],
          messages: []
        });
        await chat.save();
        console.log('New chat created with ID:', chat._id);
      }
    } else {
      return res.status(400).json({ message: 'Either chatId or otherUserId is required' });
    }

    // Add message
    console.log('Adding message to chat:', chat._id);
    await chat.addMessage(senderId, content.trim());
    
    // Explicitly update lastMessage to ensure it's set correctly
    await Chat.findByIdAndUpdate(chat._id, { lastMessage: new Date() });
    console.log('Message added, lastMessage explicitly updated');

    // Get updated chat with populated fields
    const updatedChat = await Chat.findById(chat._id)
      .populate('participants', 'username profileImage')
      .populate('messages.sender', 'username profileImage');
    console.log('Updated chat retrieved, lastMessage:', updatedChat.lastMessage);

    // Format chat for frontend (same format as getUserChats)
    const otherParticipant = updatedChat.participants.find(
      p => p._id.toString() !== senderId.toString()
    );
    
    const unreadCount = updatedChat.unreadCount.get(senderId.toString()) || 0;
    
    const formattedChat = {
      _id: updatedChat._id,
      otherUser: otherParticipant,
      messages: updatedChat.messages,
      lastMessage: updatedChat.messages[updatedChat.messages.length - 1] || null,
      unreadCount,
      lastMessageTime: updatedChat.lastMessage
    };

    res.json({ 
      message: 'Message sent successfully',
      chat: formattedChat 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark chat as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is participant
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    await chat.markAsRead(userId);

    res.json({ message: 'Chat marked as read' });
  } catch (error) {
    console.error('Error marking chat as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({
      participants: userId
    });

    let totalUnread = 0;
    chats.forEach(chat => {
      totalUnread += chat.unreadCount.get(userId.toString()) || 0;
    });

    res.json({ unreadCount: totalUnread });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 