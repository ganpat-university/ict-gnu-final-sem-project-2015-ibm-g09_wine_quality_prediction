import React from 'react';
import './Footer.css';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <h3 className="footer-title">WYNE</h3>
            <p className="footer-description">
              Your AI-powered wine prediction and discovery platform.
            </p>
          </div>

          {/* Links Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#predict">Predict</a></li>
              <li><a href="#discover">Discover</a></li>
              <li><a href="#about">About Us</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-links">
              <a href="#facebook" className="social-icon">
                <Facebook size={20} />
              </a>
              <a href="#twitter" className="social-icon">
                <Twitter size={20} />
              </a>
              <a href="#instagram" className="social-icon">
                <Instagram size={20} />
              </a>
              <a href="#linkedin" className="social-icon">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} WYNE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
