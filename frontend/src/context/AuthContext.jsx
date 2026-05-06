import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logActivity = async (email, action) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/log_activity`, {
        email,
        action
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await logActivity(email, 'signup');
    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await logActivity(email, 'login');
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await logActivity(result.user.email, 'login_google');
    return result;
  };

  const signInWithApple = async () => {
    const result = await signInWithPopup(auth, appleProvider);
    await logActivity(result.user.email, 'login_apple');
    return result;
  };

  const adminEmails = import.meta.env.VITE_ADMIN_EMAIL ? import.meta.env.VITE_ADMIN_EMAIL.split(',').map(e => e.trim()) : [];
  const isAdmin = user && adminEmails.includes(user.email);

  const value = {
    user,
    signup,
    login,
    logout,
    signInWithGoogle,
    signInWithApple,
    loading,
    isAuthModalOpen,
    setAuthModalOpen,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#760707',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Initializing WYNE...</p>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
