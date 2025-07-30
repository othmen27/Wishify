const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createWish, 
  getUserWishes, 
  getPublicWishes, 
  getWish 
} = require('../controllers/wishController');

// Create a new wish (requires authentication)
router.post('/', auth, createWish);

// Get user's wishes (requires authentication)
router.get('/my', auth, getUserWishes);

// Get all public wishes (no authentication required)
router.get('/public', getPublicWishes);

// Get a specific wish (authentication optional for public wishes)
router.get('/:id', getWish);

module.exports = router; 
