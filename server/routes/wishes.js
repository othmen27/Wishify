const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createWish, 
  getUserWishes, 
  getPublicWishes, 
  getWish,
  toggleLike,
  shareWish,
  trackView,
  updateWish,
  deleteWish
} = require('../controllers/wishController');

// Create a new wish (requires authentication)
router.post('/', auth, createWish);

// Get user's wishes (requires authentication)
router.get('/my', auth, getUserWishes);
router.get('/my-wishes', auth, getUserWishes); // Alternative route for wishlist

// Get all public wishes (no authentication required)
router.get('/public', getPublicWishes);

// Get a specific wish (authentication optional for public wishes)
router.get('/:id', getWish);

// Update a wish (requires authentication)
router.put('/:id', auth, updateWish);

// Delete a wish (requires authentication)
router.delete('/:id', auth, deleteWish);

// Like/Unlike a wish (requires authentication)
router.post('/:id/like', auth, toggleLike);

// Share a wish (requires authentication)
router.post('/:id/share', auth, shareWish);

// Track a view (no authentication required)
router.post('/:id/view', trackView);

module.exports = router; 
