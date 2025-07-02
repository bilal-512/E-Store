import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { setAuthToken } from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceOperation, setBalanceOperation] = useState('add');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    // Set auth token
    setAuthToken(token);
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      // First test the server connection
      try {
        const testResponse = await axios.get('/test');
        console.log('Server test response:', testResponse.data);
      } catch (testError) {
        console.error('Server test failed:', testError);
        setMessage('Server connection failed. Please check if the backend is running.');
        return;
      }
      
      const response = await axios.get('/admin/users');
      console.log('Users response:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        setMessage('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        navigate('/');
      } else if (error.response?.status === 403) {
        setMessage('Access denied. Admin privileges required.');
      } else {
        setMessage(`Error fetching users: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`/admin/users/${userId}/role`, { role: newRole });
      setMessage('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setMessage(`Error updating user role: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      if (currentStatus) {
        await axios.put(`/admin/users/${userId}/deactivate`);
        setMessage('User deactivated successfully');
      } else {
        await axios.put(`/admin/users/${userId}/activate`);
        setMessage('User activated successfully');
      }
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setMessage(`Error updating user status: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateUserBalance = async (userId) => {
    if (!balanceAmount || balanceAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    try {
      await axios.put(`/admin/users/${userId}/balance`, {
        balance: parseFloat(balanceAmount),
        operation: balanceOperation
      });
      setMessage('User balance updated successfully');
      setBalanceAmount('');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user balance:', error);
      setMessage(`Error updating user balance: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateUserDetails = async (userId, updatedDetails) => {
    try {
      await axios.put(`/admin/users/${userId}/details`, updatedDetails);
      setMessage('User details updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user details:', error);
      setMessage(`Error updating user details: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = (userId) => {
    const updatedDetails = {
      name: editingUser.name,
      phone: editingUser.phone,
      email: editingUser.email,
      house: editingUser.house
    };
    updateUserDetails(userId, updatedDetails);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setBalanceAmount('');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <AdminSidebar />
      <div style={{
        marginLeft: '100px',
        padding: '2rem',
        maxWidth: '1200px',
        marginRight: 'auto',
        transition: 'margin-left 0.3s',
      }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', padding: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>User Management</h1>
          <p style={{ color: 'var(--color-text)' }}>Manage all society members, their roles, and account details</p>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724',
            border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {users.map((user) => (
            <div key={user._id} style={{
              padding: '1.5rem',
              border: '1px solid #e1e5e9',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {editingUser && editingUser._id === user._id ? (
                // Edit Mode
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Name:</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Phone:</label>
                      <input
                        type="text"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email:</label>
                      <input
                        type="email"
                        value={editingUser.email || ''}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>House Size (Marla):</label>
                      <select
                        value={editingUser.house.marlaSize}
                        onChange={(e) => setEditingUser({
                          ...editingUser, 
                          house: {...editingUser.house, marlaSize: parseInt(e.target.value)}
                        })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      >
                        <option value={5}>5 Marla</option>
                        <option value={10}>10 Marla</option>
                        <option value={20}>20 Marla</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button
                      onClick={() => handleSaveUser(user._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{user.name}</h3>
                          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>Username:</strong> {user.username}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>Phone:</strong> {user.phone}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>Email:</strong> {user.email || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>Role:</strong> {user.role}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>House Size:</strong> {user.house.marlaSize} Marla
                          </div>
                          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>Balance:</strong> Rs. {user.balance}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            <strong>Status:</strong> 
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              marginLeft: '0.5rem',
                              background: user.isActive ? '#28a745' : '#dc3545',
                              color: 'white'
                            }}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleEditUser(user)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Edit Details
                    </button>

                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>

                    <button
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: user.isActive ? '#dc3545' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => setEditingUser({...user, balanceMode: true})}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Update Balance
                    </button>
                  </div>

                  {editingUser && editingUser._id === user._id && editingUser.balanceMode && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '1rem', 
                      background: '#f8f9fa', 
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}>
                      <h4 style={{ margin: '0 0 1rem 0' }}>Update Balance</h4>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                          value={balanceOperation}
                          onChange={(e) => setBalanceOperation(e.target.value)}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                          }}
                        >
                          <option value="add">Add Amount</option>
                          <option value="set">Set Amount</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Amount"
                          value={balanceAmount}
                          onChange={(e) => setBalanceAmount(e.target.value)}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            width: '150px'
                          }}
                        />
                        <button
                          onClick={() => updateUserBalance(user._id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {users.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div>No users found</div>
            <button
              onClick={fetchUsers}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers; 