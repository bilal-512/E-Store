import React from 'react';

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'none',
        color: active ? '#fff' : '#667eea',
        border: 'none',
        outline: 'none',
        fontWeight: 600,
        fontSize: '1.1rem',
        borderRadius: '12px',
        padding: '0.7rem 1.5rem',
        marginRight: '1rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        boxShadow: active ? '0 2px 8px rgba(102,126,234,0.12)' : 'none',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <Icon style={{ fontSize: '1.3rem' }} />
      {label}
    </button>
  );
}

export default TabButton; 