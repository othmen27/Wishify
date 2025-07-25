// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Simple placeholder pages
function Home() {
  return <h2>Home - List of Wishes</h2>;
}

function PostWish() {
  return <h2>Post a Wish Form</h2>;
}

function Leaderboard() {
  return <h2>Leaderboard - Top Donors</h2>;
}

function Login() {
  return <h2>Login Page</h2>;
}

function Signup() {
  return <h2>Signup Page</h2>;
}

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
