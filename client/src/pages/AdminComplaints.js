import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/complaints');
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      setMessage('Error fetching complaints');
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      await api.put(`/admin/complaints/${complaintId}/status`, { status });
      fetchComplaints();
    } catch (error) {
      setMessage('Error updating complaint status');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontSize: '1.5rem' }}>Loading complaints...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex' }}>
      <AdminSidebar />
      <div style={{ marginLeft: '100px', padding: '2rem', maxWidth: '1200px', marginRight: 'auto', transition: 'margin-left 0.3s', width: '100%' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', padding: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>Complaint Management 📝</h1>
          <p style={{ color: 'var(--color-text)' }}>View and manage all user complaints</p>
        </div>
        {message && <div style={{ color: 'red', marginBottom: '1rem' }}>{message}</div>}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>All Complaints</h2>
          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text)' }}>No complaints found.</div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {complaints.map((complaint) => (
                <div key={complaint._id} style={{
                  padding: '1.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  background: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    borderRadius: '12px',
                    width: '3.2rem',
                    height: '3.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    📝
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.1rem' }}>{complaint.complaintType}</div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: complaint.status === 'resolved' ? '#28a745' : '#ffc107',
                        color: complaint.status === 'resolved' ? '#fff' : '#222',
                        marginLeft: '0.5rem'
                      }}>{complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}</span>
                    </div>
                    <div style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>By:</span> {complaint.userId?.name || 'Unknown'}
                    </div>
                    <div style={{ color: 'var(--color-text)', marginBottom: '0.5rem', lineHeight: 1.6 }}>{complaint.complaintDetails}</div>
                    <div style={{ color: 'var(--color-text)', fontSize: '0.8rem' }}>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <select value={complaint.status} onChange={e => updateComplaintStatus(complaint._id, e.target.value)} style={{ padding: '0.5rem 1rem', border: '1.5px solid var(--color-border)', borderRadius: '8px', fontSize: '1rem', background: 'var(--color-background)', color: 'var(--color-text)', fontWeight: 600 }}>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
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

export default AdminComplaints; 