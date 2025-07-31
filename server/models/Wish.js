const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  link: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  imageUrls: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['gaming', 'fashion', 'books', 'travel', 'tech', 'home', 'sports', 'beauty', 'food', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  viewedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wish', wishSchema); 