const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserProfile, getUserWishes } = require('../controllers/userController');

// Get user profile by username (public)
router.get('/:username', getUserProfile);

// Get user's wishes by username (public)
router.get('/:username/wishes', getUserWishes);

module.exports = router; 