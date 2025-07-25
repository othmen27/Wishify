import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import PostWish from './PostWish.jsx';
import Leaderboard from './Leaderboard.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Navbar from './Navbar.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="px-4 py-6 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostWish />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;