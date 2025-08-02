import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaHeart, FaMagic } from 'react-icons/fa';
import '../App.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="footer-logo-text">
              Wishify <FaMagic className="footer-logo-sparkle" />
            </span>
            <p className="footer-tagline">
              Make a wish. Share it. Get it.
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Product</h4>
          <ul className="footer-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/discover">Discover</Link></li>
            <li><Link to="/wishlist">My Wishlist</Link></li>
            <li><Link to="/create">Create Wish</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li><a href="/help" target="_blank" rel="noopener noreferrer">Help Center</a></li>
            <li><a href="/contact" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
            <li><a href="/feedback" target="_blank" rel="noopener noreferrer">Feedback</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Legal</h4>
          <ul className="footer-links">
            <li><a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
            <li><a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><a href="/cookies" target="_blank" rel="noopener noreferrer">Cookie Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Connect</h4>
          <div className="footer-social">
            <a 
              href="https://github.com/othmen27"
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a 
              href="https://twitter.com/othmen27" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} Wishify. Made with <FaHeart className="footer-heart" /> for dreamers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 