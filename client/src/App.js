import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Create from './Create';
import Discover from './Discover';
import Profile from './Profile';
import UserProfile from './components/UserProfile';
import ProfileEdit from './components/ProfileEdit';
import WishDetail from './components/WishDetail';
import Wishlist from './Wishlist';
import About from './About';
import Navbar from './Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="px-4 py-6 min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<Create />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/wish/:id" element={<WishDetail />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;