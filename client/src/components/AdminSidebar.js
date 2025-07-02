import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { FaChartBar, FaUsers, FaClipboardList, FaStore, FaCalendarAlt, FaMoneyBill, FaCreditCard, FaSignOutAlt, FaCog, FaGift } from 'react-icons/fa';

const sidebarItems = [
  { path: '/admin', label: 'Overview', icon: FaChartBar },
  { path: '/admin/users', label: 'Users', icon: FaUsers },
  { path: '/admin/complaints', label: 'Complaints', icon: FaClipboardList },
  { path: '/admin/store', label: 'Store', icon: FaStore },
  { path: '/admin/events', label: 'Events', icon: FaGift },
  { path: '/admin/bills', label: 'Bills', icon: FaMoneyBill },
  { path: '/admin/balance-requests', label: 'Balance Requests', icon: FaCreditCard },
  // { path: '/admin/settings', label: 'Settings', icon: FaCog },
];

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="sidebar" style={{width: '90px', position: 'fixed', left: 0, top: 0, zIndex: 100}}>
      <div style={{ marginBottom: '2rem' }}>
        {/* Logo or icon */}
        <FaChartBar style={{ fontSize: '2rem', color: 'var(--color-accent)' }} />
      </div>
      {/* Logout Button at the top */}
      <button
        onClick={handleLogout}
        style={{
          marginBottom: '2rem',
          background: 'none',
          border: 'none',
          color: 'var(--color-accent)',
          fontSize: '1.7rem',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          outline: 'none',
        }}
        title="Logout"
        className="scale-hover"
      >
        <FaSignOutAlt style={{ fontSize: '1.7rem' }} />
        <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>Logout</span>
      </button>
      <nav style={{ width: '100%' }}>
        {sidebarItems.map(item => (
          <SidebarItem key={item.path} to={item.path} icon={item.icon} label={item.label} />
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar; 