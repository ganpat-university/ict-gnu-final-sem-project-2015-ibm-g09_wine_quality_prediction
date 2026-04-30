import React, { useState } from 'react';
import './Navbar.css';
import { Menu, X, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, setAuthModalOpen } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'Discover', path: '/discover' },
    ...(user ? [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'History', path: '/history' }
    ] : []),
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <NavLink to="/" className="nav-link">
              WYNE
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-menu">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <NavLink
                  to={link.path}
                  className="nav-link"
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              {user ? (
                <div className="nav-user-profile">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="nav-avatar" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="nav-avatar-placeholder"><User size={16} /></div>
                  )}
                  <button className="nav-logout-btn" onClick={logout}>
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button className="nav-login-btn" onClick={() => setAuthModalOpen(true)}>Login</button>
              )}
            </li>
          </ul>

          {/* Mobile Menu Icon */}
          <div className="hamburger" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="mobile-backdrop" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Mobile Side Drawer */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
          <X size={28} />
        </button>
        <ul className="mobile-nav-menu">
          {navLinks.map((link) => (
            <li key={link.name} className="mobile-nav-item">
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li className="mobile-nav-item">
            {user ? (
              <div className="mobile-user-info">
                <span>{user.email}</span>
                <button className="mobile-nav-logout-btn" onClick={() => { logout(); setIsOpen(false); }}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="mobile-nav-login-btn" onClick={() => { setAuthModalOpen(true); setIsOpen(false); }}>
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
