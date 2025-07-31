const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, getLeaderboard } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);

// Temporary route to view all users (remove in production!)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router; 
