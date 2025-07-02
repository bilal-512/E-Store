import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navigation from '../components/Navigation';
import { FaClipboardList, FaClock, FaCheckCircle, FaBolt, FaFire, FaShieldAlt, FaMoneyBill, FaExclamationTriangle, FaCreditCard, FaHome } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, paid, overdue

  useEffect(() => {
    fetchBills();
    fetchUserProfile();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await api.get('/bills');
      setBills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
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

  const handlePayment = async () => {
    try {
      await api.post(`/bills/${selectedBill._id}/pay`, {
        amount: parseFloat(paymentAmount)
      });
      alert('Payment successful!');
      setShowPaymentModal(false);
      setSelectedBill(null);
      setPaymentAmount('');
      fetchBills();
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
  };

  const getBillStatus = (bill) => {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const isOverdue = today > dueDate;
    
    if (bill.isPaid) return { status: 'paid', label: 'Paid', color: '#28a745' };
    if (isOverdue) return { status: 'overdue', label: 'Overdue', color: '#dc3545' };
    return { status: 'pending', label: 'Pending', color: '#ffc107' };
  };

  const getFilteredBills = () => {
    switch (filter) {
      case 'pending':
        return bills.filter(bill => !bill.isPaid && new Date() <= new Date(bill.dueDate));
      case 'paid':
        return bills.filter(bill => bill.isPaid);
      case 'overdue':
        return bills.filter(bill => !bill.isPaid && new Date() > new Date(bill.dueDate));
      default:
        return bills;
    }
  };

  const getTotalAmount = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const getPendingAmount = () => {
    return bills.filter(bill => !bill.isPaid).reduce((total, bill) => total + bill.amount, 0);
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
          Loading bills... ⏳
        </div>
      </div>
    );
  }

  const filteredBills = getFilteredBills();

  const tabs = [
    { id: 'all', label: 'All Bills', icon: FaClipboardList },
    { id: 'pending', label: 'Pending', icon: FaClock },
    { id: 'paid', label: 'Paid', icon: FaCheckCircle },
    { id: 'overdue', label: 'Overdue', icon: FaExclamationTriangle }
  ];

  const billTypeIcons = {
    electricity: FaBolt,
    gas: FaFire,
    security: FaShieldAlt,
    water: FaMoneyBill,
    other: FaCreditCard
  };

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
          <FaMoneyBill style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-accent)' }} />
          <h1 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '2.5rem' }}>
            Bills & Payments
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>
            Manage your utility bills and payments
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
            <FaClipboardList style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#667eea' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Total Bills</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              {bills.length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaCreditCard style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#007bff' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Total Amount</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              Rs. {getTotalAmount().toLocaleString()}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaClock style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ffc107' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Pending</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ffc107' }}>
              Rs. {getPendingAmount().toLocaleString()}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaHome style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#764ba2' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>House Size</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
              {userProfile?.house?.marlaSize || 5} Marla
            </p>
          </div>
        </div>

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
                  color: filter === tab.id ? '#fff' : 'var(--color-text)',
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

        {/* Bills List */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Your Bills</h2>
          
          {filteredBills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <FaClipboardList style={{ fontSize: '3rem', marginBottom: '1rem', color: '#667eea' }} />
              <p>No bills found for the selected filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredBills.map((bill) => {
                const status = getBillStatus(bill);
                const BillIcon = billTypeIcons[bill.billType] || FaCreditCard;
                return (
                  <div key={bill._id} style={{ 
                    padding: '1.5rem',
                    border: '1px solid #e1e5e9',
                    borderRadius: '12px',
                    background: 'var(--color-surface)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'var(--box-shadow)'
                    }
                  }} onClick={() => {
                    if (!bill.isPaid) {
                      setSelectedBill(bill);
                      setPaymentAmount(bill.amount.toString());
                      setShowPaymentModal(true);
                    }
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div style={{ 
                            fontSize: '1.5rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: bill.billType === 'electricity' ? '#ffd700' : 
                                       bill.billType === 'gas' ? '#ff6b6b' : '#4ecdc4'
                          }}>
                            <BillIcon style={{ fontSize: '1.5rem' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                              {bill.billType} Bill
                            </div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
                          <span><FaClock style={{ verticalAlign: 'middle' }} /> Generated: {new Date(bill.createdAt).toLocaleDateString()}</span>
                          {bill.paidAt && <span><FaCheckCircle style={{ color: '#28a745', verticalAlign: 'middle' }} /> Paid: {new Date(bill.paidAt).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          color: '#333',
                          marginBottom: '0.5rem'
                        }}>
                          Rs. {bill.amount.toLocaleString()}
                        </div>
                        
                        <div style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: status.color,
                          color: 'white',
                          display: 'inline-block'
                        }}>
                          {status.label}
                        </div>
                        
                        {!bill.isPaid && (
                          <div style={{ 
                            marginTop: '1rem',
                            fontSize: '0.8rem',
                            color: '#666'
                          }}>
                            {new Date() > new Date(bill.dueDate) && (
                              <span style={{ color: '#dc3545' }}>
                                +{Math.ceil((new Date() - new Date(bill.dueDate)) / (1000 * 60 * 60 * 24))} days late
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!bill.isPaid && (
                      <div style={{ 
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        <FaCreditCard style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} /> Click to Pay Now
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card animate-fade-in" style={{
            padding: '2rem',
            background: 'var(--color-surface)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              💳 Payment
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                {selectedBill.billType.charAt(0).toUpperCase() + selectedBill.billType.slice(1)} Bill
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                Due: {new Date(selectedBill.dueDate).toLocaleDateString()}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Amount (Rs.)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handlePayment}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                💳 Pay Now
              </button>
              
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedBill(null);
                  setPaymentAmount('');
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--color-surface)',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bills;