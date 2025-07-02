import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SidebarItem({ to, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`sidebar-item${isActive ? ' active' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 0',
        width: '100%',
        fontWeight: 600,
        fontSize: '1.5rem',
        borderRadius: 'var(--border-radius) 0 0 var(--border-radius)',
        marginBottom: '0.5rem',
      }}
    >
      <Icon style={{ fontSize: '1.7rem', marginBottom: '0.2rem' }} />
      <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{label}</span>
    </Link>
  );
}

export default SidebarItem; 