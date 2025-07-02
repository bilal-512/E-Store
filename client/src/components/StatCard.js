import React from 'react';

function StatCard({ icon: Icon, iconColor, label, value, sublabel }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--box-shadow)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minHeight: '140px',
    }}>
      <Icon style={{ fontSize: '2rem', marginBottom: '0.5rem', color: iconColor || 'var(--color-accent)' }} />
      <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{value}</span>
      {sublabel && <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.95rem' }}>{sublabel}</span>}
    </div>
  );
}

export default StatCard; 