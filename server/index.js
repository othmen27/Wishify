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
