const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wishes', require('./routes/wishes'));

// Example: app.use('/api/wishes', require('./routes/wishes'));

// Test endpoint to verify server and database connection
app.get('/api/test', async (req, res) => {
  try {
    console.log('Test endpoint hit');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    console.log('MongoDB connection name:', mongoose.connection.name);
    
    // Try to count users to test database connection
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log('User count in database:', userCount);
    
    res.json({ 
      message: 'Server is working!',
      mongoConnected: mongoose.connection.readyState === 1,
      databaseName: mongoose.connection.name,
      userCount: userCount
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to check wishes
app.get('/api/test-wishes', async (req, res) => {
  try {
    console.log('Test wishes endpoint hit');
    
    const Wish = require('./models/Wish');
    const wishCount = await Wish.countDocuments();
    console.log('Wish count in database:', wishCount);
    
    // Get all wishes
    const wishes = await Wish.find().limit(5);
    console.log('Sample wishes:', wishes);
    
    res.json({ 
      message: 'Wishes test!',
      wishCount: wishCount,
      sampleWishes: wishes
    });
  } catch (error) {
    console.error('Test wishes endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

console.log('Connecting to MongoDB...');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('Database:', process.env.MONGO_URI);
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.error('Error message:', err.message);
  });
  