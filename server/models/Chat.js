const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, { timestamps: true });

// Ensure participants are unique and sorted
chatSchema.pre('save', function(next) {
  this.participants = [...new Set(this.participants)].sort();
  next();
});

// Method to get chat between two users
chatSchema.statics.getChatBetweenUsers = function(user1Id, user2Id) {
  return this.findOne({
    participants: { $all: [user1Id, user2Id] }
  }).populate('participants', 'username profileImage');
};

// Method to add message to chat
chatSchema.methods.addMessage = function(senderId, content) {
  this.messages.push({
    sender: senderId,
    content: content
  });
  this.lastMessage = new Date();
  
  // Update unread count for other participants
  this.participants.forEach(participantId => {
    if (participantId.toString() !== senderId.toString()) {
      const currentCount = this.unreadCount.get(participantId.toString()) || 0;
      this.unreadCount.set(participantId.toString(), currentCount + 1);
    }
  });
  
  return this.save();
};

// Method to mark messages as read
chatSchema.methods.markAsRead = function(userId) {
  this.messages.forEach(message => {
    if (message.sender.toString() !== userId.toString() && !message.read) {
      message.read = true;
    }
  });
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

module.exports = mongoose.model('Chat', chatSchema); 