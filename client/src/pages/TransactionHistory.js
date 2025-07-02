import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navigation from '../components/Navigation';
import { FaChartBar, FaTicketAlt, FaCreditCard, FaShoppingCart, FaMoneyBill } from 'react-icons/fa';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, event_booking, bill_payment, store_purchase, balance_added

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/events/transactions');
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (filter === 'all') return transactions;
    return transactions.filter(transaction => transaction.type === filter);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'event_booking': return '🎫';
      case 'bill_payment': return '💳';
      case 'store_purchase': return '🛒';
      case 'balance_added': return '💰';
      default: return '📊';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'event_booking': return '#17a2b8';
      case 'bill_payment': return '#28a745';
      case 'store_purchase': return '#ffc107';
      case 'balance_added': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'event_booking': return 'Event Booking';
      case 'bill_payment': return 'Bill Payment';
      case 'store_purchase': return 'Store Purchase';
      case 'balance_added': return 'Balance Added';
      default: return 'Transaction';
    }
  };

  const tabIcons = {
    all: FaChartBar,
    event_booking: FaTicketAlt,
    bill_payment: FaCreditCard,
    store_purchase: FaShoppingCart,
    balance_added: FaMoneyBill
  };

  const tabLabels = {
    all: 'All Transactions',
    event_booking: 'Event Bookings',
    bill_payment: 'Bill Payments',
    store_purchase: 'Store Purchases',
    balance_added: 'Balance Added'
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
          Loading transactions... ⏳
        </div>
      </div>
    );
  }

  const filteredTransactions = getFilteredTransactions();

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
          <FaChartBar style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-accent)' }} />
          <h1 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '2.5rem' }}>
            Transaction History
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>
            View all your account transactions and balance history
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
            <FaChartBar style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Total Transactions</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {transactions.length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaTicketAlt style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Event Bookings</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {transactions.filter(t => t.type === 'event_booking').length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaCreditCard style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Bill Payments</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {transactions.filter(t => t.type === 'bill_payment').length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            textAlign: 'center'
          }}>
            <FaShoppingCart style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Store Purchases</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {transactions.filter(t => t.type === 'store_purchase').length}
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
            {Object.keys(tabIcons).map((tabId) => {
              const Icon = tabIcons[tabId];
              return (
                <button
                  key={tabId}
                  onClick={() => setFilter(tabId)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    background: filter === tabId 
                      ? 'var(--color-accent)'
                      : 'var(--color-surface)',
                    color: filter === tabId ? 'var(--color-text)' : 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Icon style={{ fontSize: '1.2rem' }} /> {tabLabels[tabId]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions List */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Transaction History</h2>
          
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <p>No transactions found for the selected filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredTransactions.map((transaction) => (
                <div key={transaction._id} style={{ 
                  padding: '1.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  background: 'var(--color-surface)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ 
                          fontSize: '2rem',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          background: `${getTransactionColor(transaction.type)}20`
                        }}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                            {getTransactionTypeLabel(transaction.type)}
                          </div>
                          <div style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                            {transaction.description}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        padding: '1rem',
                        background: 'var(--color-surface)',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                          <span>💰 Amount: Rs. {transaction.amount}</span>
                          <span>📊 Balance Before: Rs. {transaction.balanceBefore}</span>
                          <span>📊 Balance After: Rs. {transaction.balanceAfter}</span>
                          <span>📅 {new Date(transaction.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: getTransactionColor(transaction.type),
                        color: 'var(--color-text)',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}>
                        {transaction.status}
                      </div>
                      
                      <div style={{ 
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: transaction.amount > 0 ? 'var(--color-accent)' : 'var(--color-error)'
                      }}>
                        {transaction.amount > 0 ? '+' : ''}Rs. {transaction.amount}
                      </div>
                    </div>
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

export default TransactionHistory; 