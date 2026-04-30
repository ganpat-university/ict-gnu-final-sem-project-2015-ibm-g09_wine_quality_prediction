import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading, setAuthModalOpen } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // If not logged in, show a premium "Login Required" prompt
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          padding: '40px',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '500px'
        }}>
          <div style={{ marginBottom: '24px', color: '#ff3366' }}>
            <Lock size={48} />
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '800' }}>Unlock AI Analysis</h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Deep chemical analysis and quality predictions are restricted to our members. 
            Sign in to access our proprietary AI models.
          </p>
          <button 
            onClick={() => setAuthModalOpen(true)}
            style={{
              padding: '16px 32px',
              borderRadius: '100px',
              border: 'none',
              background: 'white',
              color: 'black',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            <Sparkles size={18} />
            Get Instant Access
          </button>
        </div>
      </div>
    );
  }

  if (user && !user.emailVerified) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Please verify your email</h2>
        <p>A verification link has been sent to {user.email}. Please check your inbox.</p>
        <button onClick={() => window.location.reload()}>I've verified</button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
