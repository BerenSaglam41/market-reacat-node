import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import requests from '../api/ApiClient';

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.account);

  const testAPI = async (name, apiCall) => {
    setLoading(true);
    try {
      console.log(`🧪 Testing ${name}...`);
      const result = await apiCall();
      setTestResults(prev => ({
        ...prev,
        [name]: { success: true, data: result, error: null }
      }));
      console.log(`✅ ${name} SUCCESS:`, result);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [name]: { success: false, data: null, error: error }
      }));
      console.error(`❌ ${name} ERROR:`, error);
    }
    setLoading(false);
  };

  const runAllTests = async () => {
    setTestResults({});
    
    // Test backend health
    await testAPI('Backend Health', () => 
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://market-reacat-node-production.up.railway.app'}`)
        .then(res => res.json())
    );

    // Test user API
    await testAPI('Get User', () => requests.account.getUser());
    
    // Test cart API
    await testAPI('Get Cart', () => requests.cart.get());
    
    // Test products API
    await testAPI('Get Products', () => requests.products.list({}));
    
    // Test orders API (if user exists)
    if (user) {
      await testAPI('Get Orders', () => requests.orders.getOrders());
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🧪 API Test Sayfası</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Environment Info:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify({
            isDev: import.meta.env.DEV,
            baseURL: import.meta.env.VITE_API_BASE_URL,
            user: user ? { id: user.id || user._id, role: user.role } : null
          }, null, 2)}
        </pre>
      </div>

      <button 
        onClick={runAllTests} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '🔄 Testing...' : '🚀 Run All API Tests'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        {Object.entries(testResults).map(([name, result]) => (
          <div key={name} style={{ 
            margin: '10px 0', 
            padding: '10px', 
            border: `2px solid ${result.success ? 'green' : 'red'}`,
            borderRadius: '5px'
          }}>
            <h4>{result.success ? '✅' : '❌'} {name}</h4>
            {result.success ? (
              <pre style={{ color: 'green' }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <pre style={{ color: 'red' }}>
                Status: {result.error?.status}<br/>
                Message: {result.error?.message}<br/>
                URL: {result.error?.config?.url}<br/>
                Full Error: {JSON.stringify(result.error, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Manual Tests:</h3>
        <button onClick={() => testAPI('Backend Health Check', () => 
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://market-reacat-node-production.up.railway.app'}/health`)
            .then(res => res.json())
        )}>
          Test Backend Health
        </button>
        
        <button onClick={() => testAPI('Order Create Test', () => 
          requests.orders.createOrder({
            address: { address: 'test', city: 'test', district: 'test', phone: 'test' },
            cartInfo: { cartname: 'test', cartnumber: 'test', expirydate: 'test', cvv: 'test' }
          })
        )} style={{ marginLeft: '10px' }}>
          Test Order Create
        </button>
      </div>
    </div>
  );
};

export default ApiTestPage;