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
      chat = await Chat.findById(chat._id)
        .populate('participants', 'username profileImage')
        .populate('messages.sender', 'username profileImage');
    } else {
      // Mark messages as read
      await chat.markAsRead(currentUserId);
    }

    res.json({ chat });
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
        chat = new Chat({
          participants: [senderId, otherUserId],
          messages: []
        });
        await chat.save();
      }
    } else {
      return res.status(400).json({ message: 'Either chatId or otherUserId is required' });
    }

    // Add message
    await chat.addMessage(senderId, content.trim());

    // Get updated chat with populated fields
    const updatedChat = await Chat.findById(chat._id)
      .populate('participants', 'username profileImage')
      .populate('messages.sender', 'username profileImage');

    res.json({ 
      message: 'Message sent successfully',
      chat: updatedChat 
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