import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';
import StatCard from '../components/StatCard';
import TabButton from '../components/TabButton';
import { FaChartBar, FaUsers, FaClipboardList, FaStore, FaGift, FaMoneyBill, FaCreditCard } from 'react-icons/fa';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, complaintsRes, productsRes, eventsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/complaints'),
        api.get('/products'),
        api.get('/events')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setComplaints(complaintsRes.data);
      setProducts(productsRes.data);
      setEvents(eventsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      await api.put(`/admin/complaints/${complaintId}/status`, { status });
      fetchDashboardData();
    } catch (err) {
      alert('Error updating complaint status');
    }
  };

  const generateBillsForAll = async () => {
    try {
      await api.post('/admin/bills/generate-all');
      alert('Bills generated successfully for all users!');
    } catch (err) {
      alert('Error generating bills');
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
          Loading admin dashboard... ⏳
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'complaints', label: 'Complaints', icon: FaClipboardList },
    { id: 'store', label: 'Store', icon: FaStore },
    { id: 'events', label: 'Events', icon: FaGift },
    { id: 'bills', label: 'Bills', icon: FaMoneyBill },
    { id: 'balance-requests', label: 'Balance Requests', icon: FaCreditCard }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <AdminSidebar />
      <div style={{
        marginLeft: '100px',
        padding: '2rem',
        maxWidth: '1400px',
        marginRight: 'auto',
        transition: 'margin-left 0.3s',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaChartBar style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }} />
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '2.2rem',
                color: 'var(--color-primary)',
                fontWeight: 700,
                letterSpacing: '-1px',
              }}>Admin Dashboard</h1>
              <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.1rem' }}>
                Manage your society operations
              </p>
            </div>
          </div>
          {/* Optional: Add profile, notifications, etc. here */}
        </div>

        {/* Tabs */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          padding: '1rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                background: activeTab === tab.id 
                  ? 'var(--color-primary)'
                  : 'var(--color-surface)',
                color: activeTab === tab.id ? '#fff' : 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <tab.icon style={{ fontSize: '1.2rem' }} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        {activeTab === 'overview' && stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <StatCard icon={FaUsers} iconColor="#667eea" label="Total Users" value={stats.stats.totalUsers} />
            <StatCard icon={FaClipboardList} iconColor="#f093fb" label="Complaints" value={stats.stats.totalComplaints} sublabel={`${stats.stats.pendingComplaints} pending`} />
            <StatCard icon={FaStore} iconColor="#43e97b" label="Products" value={stats.stats.totalProducts} />
            <StatCard icon={FaMoneyBill} iconColor="#764ba2" label="Revenue" value={`Rs. ${stats.stats.totalRevenue.toLocaleString()}`} />
          </div>
        )}

        {/* Tab Content */}
        <div style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(102,126,234,0.07)',
          padding: '2rem',
          minHeight: '500px',
        }}>
          {activeTab === 'overview' && stats && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Recent Activity</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#333' }}>Recent Complaints</h3>
                  {stats.recentComplaints.map((complaint, i) => (
                    <div key={complaint._id} style={{ 
                      padding: '1rem',
                      border: '1px solid #e1e5e9',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      background: '#f8f9fa',
                    }}>
                      <div style={{ fontWeight: '600' }}>{complaint.complaintType}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        by {complaint.userId?.name || 'Unknown'}
                      </div>
                      <div style={{ 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        background: complaint.status === 'resolved' ? '#28a745' : '#ffc107',
                        color: complaint.status === 'resolved' ? 'white' : 'black',
                        display: 'inline-block',
                        marginTop: '0.5rem'
                      }}>
                        {complaint.status}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#333' }}>Recent Orders</h3>
                  {stats.recentOrders.map((order, i) => (
                    <div key={order._id} style={{ 
                      padding: '1rem',
                      border: '1px solid #e1e5e9',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      background: '#f8f9fa',
                    }}>
                      <div style={{ fontWeight: '600' }}>Order #{order._id.slice(-6)}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        by {order.userId?.name || 'Unknown'}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.9rem' }}>
                        Rs. {order.totalAmount?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#333', margin: 0 }}>User Management</h2>
                <Link to="/admin/users" style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  👥 Manage Users
                </Link>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {users.slice(0, 5).map((user) => (
                  <div key={user._id} style={{ 
                    padding: '1rem',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{user.name}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        {user.username} • {user.role}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        Balance: Rs. {user.balance} • House: {user.house.marlaSize} Marla
                      </div>
                    </div>
                    <div style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      background: user.isActive ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                ))}
                {users.length > 5 && (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                    ... and {users.length - 5} more users
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Complaint Management</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {complaints.map((complaint) => (
                  <div key={complaint._id} style={{ 
                    padding: '1rem',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{complaint.complaintType}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          by {complaint.userId?.name || 'Unknown'}
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>{complaint.complaintDetails}</div>
                      </div>
                      <div>
                        <select 
                          value={complaint.status}
                          onChange={(e) => updateComplaintStatus(complaint._id, e.target.value)}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Store Management</h2>
                <Link to="/admin/store" style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🛒 Manage Store
                </Link>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {products.slice(0, 5).map((product) => (
                  <div key={product._id} style={{ 
                    padding: '1rem',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{product.name}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        Quantity: {product.quantity} • Price: Rs. {product.price}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      background: product.quantity > 0 ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                    ... and {products.length - 5} more products
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Event Management</h2>
                <Link to="/admin/events" style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🎉 Manage Events
                </Link>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {events.slice(0, 5).map((event) => (
                  <div key={event._id} style={{ 
                    padding: '1rem',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{event.name}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                      <span>👥 Capacity: {event.capacity}</span>
                      <span>🎫 Booked: {event.bookedUsers?.length || 0}</span>
                      <span>💰 Price: {event.ticketPrice === 0 ? 'Free' : `Rs. ${event.ticketPrice}`}</span>
                    </div>
                  </div>
                ))}
                {events.length > 5 && (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                    ... and {events.length - 5} more events
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bills' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Bill Management</h2>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', color: '#666' }}>
                  Generate bills for all users at once
                </p>
                <button
                  onClick={generateBillsForAll}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🧾 Generate Bills for All Users
                </button>
              </div>
            </div>
          )}

          {activeTab === 'balance-requests' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Balance Request Management</h2>
                <Link to="/admin/balance-requests" style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💳 Manage Balance Requests
                </Link>
              </div>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Balance Request Management</h3>
                <p style={{ color: '#666', margin: '0 0 1.5rem 0' }}>
                  Review and process user balance requests. Users can request balance additions from the admin panel.
                </p>
                <Link to="/admin/balance-requests" style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  View All Balance Requests
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 