import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navigation from '../components/Navigation';
import { FaClipboardList, FaClock, FaCheckCircle, FaUser, FaPlus, FaPen, FaTimesCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    complaintType: '',
    complaintDetails: ''
  });
  const [filter, setFilter] = useState('all'); // all, pending, resolved
  const [userProfile, setUserProfile] = useState(null);

  const complaintCategories = [
    { value: 'maintenance', label: '🏠 Maintenance', icon: '🏠' },
    { value: 'security', label: '🛡️ Security', icon: '🛡️' },
    { value: 'noise', label: '🔊 Noise', icon: '🔊' },
    { value: 'parking', label: '🚗 Parking', icon: '🚗' },
    { value: 'cleaning', label: '🧹 Cleaning', icon: '🧹' },
    { value: 'electricity', label: '⚡ Electricity', icon: '⚡' },
    { value: 'water', label: '💧 Water', icon: '💧' },
    { value: 'gas', label: '🔥 Gas', icon: '🔥' },
    { value: 'internet', label: '🌐 Internet', icon: '🌐' },
    { value: 'other', label: '📋 Other', icon: '📋' }
  ];

  const tabs = [
    { id: 'all', label: 'All Complaints', icon: FaClipboardList },
    { id: 'pending', label: 'Pending', icon: FaClock },
    { id: 'resolved', label: 'Resolved', icon: FaCheckCircle }
  ];

  useEffect(() => {
    fetchComplaints();
    fetchUserProfile();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      alert('Complaint submitted successfully!');
      setFormData({ complaintType: '', complaintDetails: '' });
      setShowForm(false);
      fetchComplaints();
    } catch (error) {
      alert('Error submitting complaint. Please try again.');
    }
  };

  const getComplaintIcon = (type) => {
    const category = complaintCategories.find(cat => cat.value === type);
    return category ? category.icon : '📋';
  };

  const getComplaintLabel = (type) => {
    const category = complaintCategories.find(cat => cat.value === type);
    return category ? category.label.split(' ')[1] : 'Other';
  };

  const getFilteredComplaints = () => {
    switch (filter) {
      case 'pending':
        return complaints.filter(complaint => complaint.status === 'pending');
      case 'resolved':
        return complaints.filter(complaint => complaint.status === 'resolved');
      default:
        return complaints;
    }
  };

  const getStatusColor = (status) => {
    return status === 'resolved' ? '#28a745' : '#ffc107';
  };

  const getDaysSinceSubmission = (createdAt) => {
    const days = Math.ceil((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days} day${days > 1 ? 's' : ''} ago`;
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
          Loading complaints... ⏳
        </div>
      </div>
    );
  }

  const filteredComplaints = getFilteredComplaints();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <Navigation />
      
      <div style={{ 
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div className="card animate-fade-in" style={{ 
          padding: '2rem',
          marginBottom: '2rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h1 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '2.5rem' }}>
            Complaints & Issues
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>
            Report issues and track their resolution
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaClock style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ffc107' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Pending</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ffc107' }}>
              {complaints.filter(c => c.status === 'pending').length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaCheckCircle style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#28a745' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Resolved</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#28a745' }}>
              {complaints.filter(c => c.status === 'resolved').length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaUser style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#667eea' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Your House</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              {userProfile?.house?.marlaSize || 5} Marla
            </p>
          </div>
        </div>

        {/* Submit Complaint Button */}
        <div className="card" style={{ 
          padding: '1rem',
          background: 'var(--color-surface)',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '1rem 2rem',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaPlus style={{ fontSize: '1.2rem' }} /> Submit New Complaint
          </button>
        </div>

        {/* Submit Complaint Form */}
        {showForm && (
          <div className="card animate-fade-in" style={{ 
            padding: '2rem',
            background: 'var(--color-surface)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Submit New Complaint</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text)' }}>
                  Complaint Category
                </label>
                <select
                  value={formData.complaintType}
                  onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select a category</option>
                  {complaintCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text)' }}>
                  Complaint Details
                </label>
                <textarea
                  value={formData.complaintDetails}
                  onChange={(e) => setFormData({ ...formData, complaintDetails: e.target.value })}
                  required
                  rows="4"
                  placeholder="Please describe your complaint in detail..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaPen style={{ fontSize: '1.2rem' }} /> Submit Complaint
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ complaintType: '', complaintDetails: '' });
                  }}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="card" style={{ 
          padding: '1rem',
          background: 'var(--color-surface)',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  background: filter === tab.id 
                    ? 'var(--color-primary)'
                    : 'var(--color-surface)',
                  color: filter === tab.id ? 'white' : 'var(--color-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <tab.icon style={{ fontSize: '1.2rem' }} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Your Complaints</h2>
          
          {filteredComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <p>No complaints found for the selected filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredComplaints.map((complaint) => (
                <div key={complaint._id} style={{ 
                  padding: '1.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  background: 'var(--color-surface)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        fontSize: '2rem',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: 'var(--color-primary)',
                        opacity: '0.1',
                        color: '#fff'
                      }}>
                        {getComplaintIcon(complaint.complaintType)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#fff' }}>
                          {getComplaintLabel(complaint.complaintType)}
                        </div>
                        <div style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                          Submitted {getDaysSinceSubmission(complaint.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: getStatusColor(complaint.status),
                      color: 'white'
                    }}>
                      {complaint.status === 'resolved' ? '✅ Resolved' : '⏰ Pending'}
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '1rem',
                    background: 'var(--color-primary)',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    color: '#fff'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#fff' }}>
                      Complaint Details:
                    </div>
                    <div style={{ color: '#fff', lineHeight: '1.5' }}>
                      {complaint.complaintDetails}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    <span>📅 Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    {complaint.status === 'resolved' && (
                      <span>✅ Resolved: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Complaints;