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

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, location, paypalEmail, cashappUsername } = req.body;
    
    // Check if username is being changed and if it's already taken
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (paypalEmail !== undefined) updateData.paypalEmail = paypalEmail;
    if (cashappUsername !== undefined) updateData.cashappUsername = cashappUsername;
    
    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `http://localhost:5000/uploads/profiles/${req.file.filename}`;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user's profile for editing
exports.getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 