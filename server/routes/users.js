const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getUserProfile, getUserWishes, updateProfile, getCurrentUserProfile } = require('../controllers/userController');

// Get current user's profile for editing
router.get('/profile/edit', auth, getCurrentUserProfile);

// Update current user's profile
router.put('/profile/edit', auth, upload.single('profileImage'), updateProfile);

// Get user profile by username (public)
router.get('/:username', getUserProfile);

// Get user's wishes by username (public)
router.get('/:username/wishes', getUserWishes);

module.exports = router; 