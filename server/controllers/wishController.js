const Wish = require('../models/Wish');
const User = require('../models/User');

// Create a new wish
exports.createWish = async (req, res) => {
  try {
    console.log('=== WISH CREATION REQUEST ===');
    console.log('User ID:', req.user._id);
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);
    
    const { title, description, link, imageUrl, imageUrls, category, priority, visibility } = req.body;
    
    console.log('Extracted data:', { title, description, link, imageUrl, imageUrls, category, priority, visibility });
    
    const wish = new Wish({
      user: req.user._id,
      title,
      description,
      link,
      imageUrl,
      imageUrls: imageUrls || [],
      category,
      priority,
      visibility
    });
    
    console.log('Wish object created:', wish);
    
    try {
      console.log('Attempting to save wish to database...');
      await wish.save();
      console.log('✅ Wish saved to database successfully!');
      console.log('Wish ID:', wish._id);
      
      // Award points to user for creating a wish
      const pointsToAward = 10; // Base points for creating a wish
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: pointsToAward }
      });
      console.log(`✅ Awarded ${pointsToAward} points to user ${req.user._id}`);
      
      console.log('==========================');
    } catch (saveError) {
      console.error('❌ ERROR saving wish to database:', saveError);
      console.error('Save error message:', saveError.message);
      console.error('Save error stack:', saveError.stack);
      throw saveError; // Re-throw to be caught by outer catch
    }
    
    res.status(201).json({
      message: 'Wish created successfully',
      wish
    });
  } catch (error) {
    console.error('❌ ERROR creating wish:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's wishes
exports.getUserWishes = async (req, res) => {
  try {
    const wishes = await Wish.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ wishes });
  } catch (error) {
    console.error('Error fetching user wishes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all public wishes (for discover feed)
exports.getPublicWishes = async (req, res) => {
  try {
    const wishes = await Wish.find({ visibility: 'public' })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    res.json({ wishes });
  } catch (error) {
    console.error('Error fetching public wishes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single wish
exports.getWish = async (req, res) => {
  try {
    const wish = await Wish.findById(req.params.id).populate('user', 'username profileImage');
    if (!wish) {
      return res.status(404).json({ message: 'Wish not found' });
    }
    
    // If wish is public, allow access without authentication
    if (wish.visibility === 'public') {
      return res.json(wish);
    }
    
    // For private wishes, require authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user can view this wish (owner)
    if (wish.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(wish);
  } catch (error) {
    console.error('Error fetching wish:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 