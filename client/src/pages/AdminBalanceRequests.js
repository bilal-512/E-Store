import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { setAuthToken } from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

function AdminBalanceRequests() {
  const [balanceRequests, setBalanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    setAuthToken(token);
    fetchBalanceRequests();
  }, [navigate]);

  const fetchBalanceRequests = async () => {
    try {
      const response = await axios.get('/admin/balance-requests');
      setBalanceRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching balance requests:', error);
      setMessage(`Error fetching balance requests: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  const processRequest = async (requestId, status) => {
    try {
      await axios.put(`/admin/balance-requests/${requestId}/process`, {
        status,
        adminNotes: adminNotes.trim()
      });
      
      setMessage(`Balance request ${status} successfully`);
      setAdminNotes('');
      fetchBalanceRequests();
    } catch (error) {
      console.error('Error processing balance request:', error);
      setMessage(`Error processing request: ${error.response?.data?.message || error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredRequests = balanceRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading balance requests...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd' }}>
      <AdminSidebar />
      <div style={{
        marginLeft: '80px',
        padding: '2rem',
        maxWidth: '1200px',
        marginRight: 'auto',
        marginLeft: '100px',
        transition: 'margin-left 0.3s',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(102,126,234,0.07)',
          padding: '2rem',
          marginBottom: '2rem',
        }}>
          <h1 style={{ color: '#222', marginBottom: '0.5rem', fontWeight: 700 }}>Balance Request Management 💰</h1>
          <p style={{ color: '#888' }}>Review and process user balance requests</p>
        </div>

        {/* Message */}
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

        {/* Stats */}
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Total Requests</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              {balanceRequests.length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Pending</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ffc107' }}>
              {balanceRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Approved</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#28a745' }}>
              {balanceRequests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Rejected</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#dc3545' }}>
              {balanceRequests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: '1rem' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white'
            }}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Balance Requests List */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredRequests.map((request) => (
            <div key={request._id} style={{
              padding: '1.5rem',
              border: '1px solid #e1e5e9',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {request.userId?.name || request.username}
                  </h3>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Username:</strong> {request.username}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Email:</strong> {request.userEmail || 'N/A'}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Phone:</strong> {request.userPhone || 'N/A'}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Requested Amount:</strong> Rs. {request.requestedAmount.toLocaleString()}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Reason:</strong> {request.reason}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    <strong>Requested on:</strong> {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    background: getStatusColor(request.status),
                    color: 'white'
                  }}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>

              {request.status === 'pending' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Process Request</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this request..."
                      rows="3"
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
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => processRequest(request._id, 'approved')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => processRequest(request._id, 'rejected')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {request.status !== 'pending' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Processed by:</strong> {request.processedBy?.name || 'Admin'}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Processed on:</strong> {new Date(request.processedAt).toLocaleString()}
                  </div>
                  {request.adminNotes && (
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      <strong>Admin Notes:</strong> {request.adminNotes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>No Balance Requests</h3>
            <p style={{ color: '#666', margin: 0 }}>
              {filter === 'all' ? 'No balance requests found.' : `No ${filter} balance requests found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBalanceRequests; 