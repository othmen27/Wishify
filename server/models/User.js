const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String,
    required: false
  },
  paypalEmail: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },
  cashappUsername: {
    type: String,
    required: false,
    trim: true
  },
  profileImage: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 