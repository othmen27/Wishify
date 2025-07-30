const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('Registration attempt received:', { username: req.body.username, email: req.body.email });
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(409).json({ message: 'Email already in use.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('User successfully registered:', { username, email, id: user._id });
    res.status(201).json({ 
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt received:', { email: req.body.email });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('User successfully logged in:', { username: user.username, email, id: user._id });
    res.status(200).json({ 
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);   
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}; 

exports.getCurrentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('=== Profile Update Request ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User from auth middleware:', req.user);
    
    // Check if req.body exists and has content
    if (!req.body) {
      console.log('❌ req.body is undefined');
      return res.status(400).json({ message: 'Request body is missing.' });
    }
    
    if (Object.keys(req.body).length === 0 && !req.file) {
      console.log('❌ req.body is empty and no file uploaded');
      return res.status(400).json({ message: 'No data provided for update.' });
    }

    const { username, paypalEmail, cashappUsername } = req.body;
    console.log('✅ Extracted data:', { username, paypalEmail, cashappUsername });
    
    const userId = req.user._id;
    console.log('✅ User ID:', userId);

    // Validate input
    if (paypalEmail && !paypalEmail.includes('@')) {
      return res.status(400).json({ message: 'Invalid PayPal email format.' });
    }

    if (username && username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }

    // Check if username is already taken (if username is being updated)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username: username.trim() });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already taken.' });
      }
    }

    // Handle profile image upload
    let profileImageUrl = req.user.profileImage; // Keep existing image if no new one
    if (req.file) {
      // Create the URL for the uploaded file
      profileImageUrl = `/uploads/${req.file.filename}`;
      console.log('✅ New profile image uploaded:', profileImageUrl);
    }

    // Update user profile
    const updateData = {
      paypalEmail: paypalEmail || null,
      cashappUsername: cashappUsername || null,
      profileImage: profileImageUrl
    };

    // Only update username if provided and different
    if (username && username.trim() !== req.user.username) {
      updateData.username = username.trim();
    }

    console.log('✅ Update data:', updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' } // Return updated user without password
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('✅ Profile updated successfully for user:', { username: updatedUser.username, id: updatedUser._id });
    res.json({ 
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}; 
