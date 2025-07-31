const User = require('../models/User');
const Wish = require('../models/Wish');

// Get user profile by username
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username }).select('-password -email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's wishes by username
exports.getUserWishes = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get wishes based on visibility and current user
    let query = { user: user._id };
    
    // If not the current user, only show public wishes
    if (!req.user || req.user._id.toString() !== user._id.toString()) {
      query.visibility = 'public';
    }
    
    const wishes = await Wish.find(query)
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    
    res.json({ wishes });
  } catch (error) {
    console.error('Error fetching user wishes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 