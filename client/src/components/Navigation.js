import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { FaHome, FaMoneyBill, FaClipboardList, FaGift, FaStore, FaUserMd, FaChartBar, FaCrown, FaSignOutAlt } from 'react-icons/fa';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('user');
  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/user/profile');
          setUserRole(response.data.role || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    
    fetchUserRole();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/bills', label: 'Bills', icon: FaMoneyBill },
    { path: '/complaints', label: 'Complaints', icon: FaClipboardList },
    { path: '/events', label: 'Events', icon: FaGift },
    { path: '/store', label: 'Store', icon: FaStore },
    { path: '/appointments', label: 'Appointments', icon: FaUserMd },
    { path: '/transactions', label: 'Transaction History', icon: FaChartBar }
  ];

  // Add admin link for admin users
  if (userRole === 'admin' || userRole === 'super_admin') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: FaCrown });
    navItems.push({ path: '/admin/balance-requests', label: 'Balance Requests', icon: FaMoneyBill });
  }

  return (
    <nav style={{ 
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        color: 'var(--color-text)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaHome style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
          <span style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            color: 'var(--color-primary)'
          }}>
            Society Manager
          </span>
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <span style={{ 
              fontSize: '0.8rem',
              background: 'var(--color-accent)',
              color: '#fff',
              padding: '0.2rem 0.5rem',
              borderRadius: '12px',
              fontWeight: 'bold',
              marginLeft: '0.5rem'
            }}>
              {userRole === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          alignItems: 'center',
          color: 'var(--color-text)'
        }}>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              style={{ 
                color: isActive(item.path) ? 'var(--color-primary)' : 'var(--color-text)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: isActive(item.path) ? 'var(--color-sidebar-active)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: isActive(item.path) ? '600' : '400',
                border: item.path === '/admin' ? '2px solid var(--color-accent)' : 'none'
              }}
              className="animate-fade-in"
            >
              <item.icon style={{ fontSize: '1.2rem' }} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'var(--color-accent)',
              color: '#fff', 
              border: 'none', 
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            className="animate-fade-in"
          >
            <FaSignOutAlt style={{ fontSize: '1.2rem' }} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }} className="animate-slide-in">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={() => setIsMenuOpen(false)}
              style={{ 
                color: isActive(item.path) ? '#667eea' : '#333',
                textDecoration: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: isActive(item.path) ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: isActive(item.path) ? '600' : '400',
                border: item.path === '/admin' ? '2px solid #ffd700' : 'none'
              }}
            >
              <item.icon style={{ fontSize: '1.2rem' }} />
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              marginTop: '0.5rem'
            }}
            className="animate-fade-in"
          >
            <FaSignOutAlt style={{ fontSize: '1.2rem' }} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navigation; 