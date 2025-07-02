import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    name: '', 
    phone: '',
    email: '',
    houseSize: 5
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-bg" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--color-background)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating background shapes */}
      <div className="float-bg">
        <div className="float-circle float1"></div>
        <div className="float-circle float2"></div>
        <div className="float-circle float3"></div>
        <div className="float-circle float4"></div>
      </div>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            🏘️
          </div>
          <h1 className="gradient-text" style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>
            Join Society Manager
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text)', fontSize: '1rem' }}>
            Create your account to get started
          </p>
        </div>
        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                Username
              </label>
              <input
                name="username"
                placeholder="Choose username"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter full name"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                Phone Number
              </label>
              <input
                name="phone"
                placeholder="Enter phone number"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                Email (Optional)
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter email address"
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>
              House Size
            </label>
            <select
              name="houseSize"
              onChange={handleChange}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value={5}>🏠 5 Marla House</option>
              <option value={10}>🏘️ 10 Marla House</option>
              <option value={20}>🏢 20 Marla House</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="auth-btn"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="loading-spinner"></span>
                Creating account...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                ✨ Create Account
              </span>
            )}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e1e5e9' }}>
          <p style={{ margin: 0, color: 'var(--color-text)' }}>
            Already have an account?{' '}
            <Link to="/" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
