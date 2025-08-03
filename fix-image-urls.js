const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const Wish = require('./server/models/Wish');
const User = require('./server/models/User');

async function fixImageUrls() {
  try {
    console.log('Starting to fix image URLs...');
    
    // Fix wish images
    const wishes = await Wish.find({
      $or: [
        { imageUrls: { $regex: 'localhost:5000' } },
        { 'imageUrls.0': { $regex: 'localhost:5000' } }
      ]
    });
    
    console.log(`Found ${wishes.length} wishes with localhost URLs`);
    
    for (const wish of wishes) {
      if (wish.imageUrls && Array.isArray(wish.imageUrls)) {
        wish.imageUrls = wish.imageUrls.map(url => 
          url.replace('http://localhost:5000', 'http://18.209.102.221')
        );
        await wish.save();
        console.log(`Fixed wish: ${wish.title}`);
      }
    }
    
    // Fix user profile images
    const users = await User.find({
      profileImage: { $regex: 'localhost:5000' }
    });
    
    console.log(`Found ${users.length} users with localhost profile URLs`);
    
    for (const user of users) {
      if (user.profileImage) {
        user.profileImage = user.profileImage.replace('http://localhost:5000', 'http://18.209.102.221');
        await user.save();
        console.log(`Fixed user: ${user.username}`);
      }
    }
    
    console.log('Image URL fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing image URLs:', error);
    process.exit(1);
  }
}

fixImageUrls(); 