import React, { useState } from 'react';
import api from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

function AdminBills() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateBillsForAll = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post('/admin/bills/generate-all');
      setMessage('Bills generated successfully for all users!');
    } catch (err) {
      setMessage('Error generating bills');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <AdminSidebar />
      <div style={{ marginLeft: '100px', padding: '2rem', maxWidth: '1200px', marginRight: 'auto', transition: 'margin-left 0.3s' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', padding: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>Bill Management 💰</h1>
          <p style={{ color: 'var(--color-text)' }}>Generate and manage bills for all users</p>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Generate Bills</h2>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Generate bills for all users at once</p>
            <button
              onClick={generateBillsForAll}
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Generating...' : '💳 Generate Bills for All Users'}
            </button>
            {message && <div style={{ marginTop: '1rem', color: message.includes('success') ? '#28a745' : '#dc3545' }}>{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBills; 