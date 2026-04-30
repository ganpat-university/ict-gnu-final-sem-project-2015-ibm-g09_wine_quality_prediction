import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';
import { X, Mail, Lock } from 'lucide-react';

const AuthModal = () => {
  const { signup, login, signInWithGoogle, signInWithApple, isAuthModalOpen, setAuthModalOpen } = useAuth();
  const onClose = () => setAuthModalOpen(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
        alert('Verification email sent! Please check your inbox.');
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (providerFn) => {
    setError('');
    try {
      await providerFn();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button type="button" className="auth-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to access Predict' : 'Join us to explore the future'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-social">
          <button className="social-btn google" onClick={() => handleSocialSignIn(signInWithGoogle)}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            Continue with Google
          </button>
          <button className="social-btn apple" onClick={() => handleSocialSignIn(signInWithApple)}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            Continue with Apple
          </button>
        </div>

        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Sign In</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
