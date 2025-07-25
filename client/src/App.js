import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import PostWish from './PostWish.jsx';
import Leaderboard from './Leaderboard.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: 10 }}>Home</Link>
      <Link to="/post" style={{ marginRight: 10 }}>Post Wish</Link>
      <Link to="/leaderboard" style={{ marginRight: 10 }}>Leaderboard</Link>
      <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
      <Link to="/signup" style={{ marginRight: 10 }}>Signup</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem' }}>
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