import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { setAuthToken } from '../api/axios';
import Navigation from '../components/Navigation';
import { FaFileInvoice, FaClipboardList, FaGift, FaStore, FaUserMd, FaMoneyBill, FaHome, FaUser } from 'react-icons/fa';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [message, setMessage] = useState('');
  const [balanceRequests, setBalanceRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchUserProfile();
      fetchBalanceRequests();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const fetchBalanceRequests = async () => {
    try {
      console.log('Fetching balance requests...');
      const response = await api.get('/user/balance-request/history');
      console.log('Balance requests response:', response.data);
      setBalanceRequests(response.data);
    } catch (error) {
      console.error('Error fetching balance requests:', error);
      console.error('Error response:', error.response);
      // Don't show error message for this as it's not critical
    }
  };

  const handleBalanceRequest = async () => {
    if (!requestAmount || requestAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    if (!requestReason.trim()) {
      setMessage('Please provide a reason for the request');
      return;
    }

    try {
      console.log('Submitting balance request:', {
        requestedAmount: parseFloat(requestAmount),
        reason: requestReason.trim()
      });
      
      const response = await api.post('/user/balance-request', {
        requestedAmount: parseFloat(requestAmount),
        reason: requestReason.trim()
      });
      
      console.log('Balance request response:', response.data);
      setMessage('Balance request submitted successfully!');
      setRequestAmount('');
      setRequestReason('');
      setShowBalanceModal(false);
      fetchBalanceRequests();
    } catch (error) {
      console.error('Balance request error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response) {
        // Server responded with error status
        setMessage(`Error: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response received
        setMessage('Error: No response from server. Please check if the server is running.');
      } else {
        // Something else happened
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'var(--color-background)'
      }}>
        <div style={{ 
          background: 'var(--color-surface)', 
          padding: '2rem', 
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          color: 'var(--color-text)',
          fontSize: '1.2rem'
        }}>
          Loading your dashboard... ⏳
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'var(--color-background)'
      }}>
        <div style={{ 
          background: 'var(--color-surface)', 
          padding: '2rem', 
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          color: 'var(--color-text)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--color-primary)' }}>Please login to continue</h2>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const featureCards = [
    {
      path: '/bills',
      icon: FaFileInvoice,
      title: 'Bills',
      description: 'View and pay your utility bills',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stats: 'Manage payments'
    },
    {
      path: '/complaints',
      icon: FaClipboardList,
      title: 'Complaints',
      description: 'Submit and track complaints',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stats: 'Report issues'
    },
    {
      path: '/events',
      icon: FaGift,
      title: 'Events',
      description: 'View and book society events',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stats: 'Join activities'
    },
    {
      path: '/store',
      icon: FaStore,
      title: 'Store',
      description: 'Shop for products',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      stats: 'Buy essentials'
    },
    {
      path: '/appointments',
      icon: FaUserMd,
      title: 'Appointments',
      description: 'Book doctor appointments',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      stats: 'Health services'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <Navigation />
      
      <div style={{ 
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Section */}
        <div className="card animate-fade-in" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'white'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ 
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Welcome back, {user.name}!{' '}
                <FaUser style={{ color: '#667eea', verticalAlign: 'middle' }} />
              </h1>
              <p style={{ margin: 0, color: '#666' }}>Manage your society activities</p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FaMoneyBill style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#667eea' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Balance</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              Rs. {user.balance?.toLocaleString() || 0}
            </p>
            <button
              onClick={() => setShowBalanceModal(true)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Request Balance
            </button>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FaHome style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#764ba2' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>House Size</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              {user.house?.marlaSize || 5} Marla
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FaUser style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#43e97b' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Role</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
            </p>
          </div>
        </div>

        {/* Balance Request History */}
        {balanceRequests.length > 0 && (
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            marginBottom: '2rem',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Balance Request History</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {balanceRequests.slice(0, 3).map((request) => (
                <div key={request._id} style={{
                  padding: '1rem',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  background: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '600' }}>Rs. {request.requestedAmount.toLocaleString()}</div>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      background: request.status === 'pending' ? '#ffc107' : 
                                request.status === 'approved' ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {request.reason}
                  </div>
                  <div style={{ color: '#999', fontSize: '0.8rem' }}>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <h2 style={{ 
          color: 'white', 
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontSize: '2rem'
        }}>
          Quick Actions
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem'
        }}>
          {featureCards.map((card, index) => (
            <Link 
              key={card.path}
              to={card.path} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                animationDelay: `${index * 0.1}s`
              }}
              className="animate-fade-in"
            >
              <div className="card" style={{ 
                padding: '2rem',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    <card.icon style={{ color: '#667eea' }} />
                  </div>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 1rem 0',
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    {card.description}
                  </p>
                </div>
                <div style={{ 
                  padding: '0.5rem 1rem',
                  background: card.color,
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  alignSelf: 'flex-start'
                }}>
                  {card.stats}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Balance Request Modal */}
      {showBalanceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Request Balance</h2>
            
            {message && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                background: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                color: message.includes('successfully') ? '#155724' : '#721c24',
                border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {message}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Amount (Rs.)
              </label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Reason
              </label>
              <textarea
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder="Please provide a reason for your balance request"
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowBalanceModal(false);
                  setRequestAmount('');
                  setRequestReason('');
                  setMessage('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBalanceRequest}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
