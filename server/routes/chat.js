const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all chats for current user
router.get('/', chatController.getUserChats);

// Get unread message count
router.get('/unread/count', chatController.getUnreadCount);

// Send message
router.post('/message', chatController.sendMessage);

// Mark chat as read
router.put('/:chatId/read', chatController.markAsRead);

// Get specific chat with another user (must be last to avoid conflicts)
router.get('/:otherUserId', chatController.getChat);

module.exports = router; 