import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

const DebugPage = () => {
  const { user, status } = useSelector((state) => state.account);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 Debug Page Info:', {
      user,
      status,
      location: location.pathname,
      localStorage: localStorage.getItem('user'),
      cookies: document.cookie
    });
  }, [user, status, location]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔍 Debug Information</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>User State:</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Status:</h3>
        <p>{status}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Location:</h3>
        <p>{location.pathname}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>LocalStorage:</h3>
        <pre>{localStorage.getItem('user')}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Cookies:</h3>
        <pre>{document.cookie}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Environment:</h3>
        <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/login')}>Go to Login</button>
        <button onClick={() => navigate('/checkout')} style={{ marginLeft: '10px' }}>
          Try Checkout
        </button>
        <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default DebugPage;