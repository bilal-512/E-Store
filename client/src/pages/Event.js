import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navigation from '../components/Navigation';
import { FaClipboardList, FaClock, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaMoneyBill, FaExclamationTriangle, FaBan, FaGift, FaUser } from 'react-icons/fa';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, booked
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchUserProfile();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
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

  const handleBooking = async () => {
    try {
      const response = await api.post(`/events/${selectedEvent._id}/book`);
      
      // Show success message with balance information
      if (selectedEvent.ticketPrice > 0) {
        alert(`Event booked successfully! Rs. ${selectedEvent.ticketPrice} deducted from your balance. New balance: Rs. ${response.data.newBalance}`);
      } else {
        alert('Event booked successfully!');
      }
      
      setShowBookingModal(false);
      setSelectedEvent(null);
      fetchEvents();
      fetchUserProfile(); // Refresh user profile to get updated balance
    } catch (error) {
      if (error.response?.data?.message === 'Insufficient balance') {
        alert(`Insufficient balance! You need Rs. ${error.response.data.requiredAmount} but have Rs. ${error.response.data.currentBalance}`);
      } else {
        alert('Booking failed. Please try again.');
      }
    }
  };

  const isEventBooked = (event) => {
    return event.bookedUsers?.some(user => user === userProfile?.username);
  };

  const isEventFull = (event) => {
    return event.bookedUsers?.length >= event.capacity;
  };

  const isEventPast = (event) => {
    return new Date(event.date) < new Date();
  };

  const isEventUpcoming = (event) => {
    return new Date(event.date) > new Date();
  };

  const getFilteredEvents = () => {
    switch (filter) {
      case 'upcoming':
        return events.filter(event => isEventUpcoming(event));
      case 'past':
        return events.filter(event => isEventPast(event));
      case 'booked':
        return events.filter(event => isEventBooked(event));
      default:
        return events;
    }
  };

  const getEventStatus = (event) => {
    if (isEventPast(event)) return { status: 'past', label: 'Past Event', color: '#6c757d' };
    if (isEventFull(event)) return { status: 'full', label: 'Fully Booked', color: '#dc3545' };
    if (isEventBooked(event)) return { status: 'booked', label: 'Booked', color: '#28a745' };
    return { status: 'available', label: 'Available', color: '#17a2b8' };
  };

  const getDaysUntilEvent = (eventDate) => {
    const days = Math.ceil((new Date(eventDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Past';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const tabs = [
    { id: 'all', label: 'All Events', icon: FaClipboardList },
    { id: 'upcoming', label: 'Upcoming', icon: FaClock },
    { id: 'booked', label: 'My Bookings', icon: FaCheckCircle },
    { id: 'past', label: 'Past Events', icon: FaCalendarAlt }
  ];

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
          Loading events... ⏳
        </div>
      </div>
    );
  }

  const filteredEvents = getFilteredEvents();

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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '2.5rem' }}>
            Society Events
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>
            Discover and book exciting society events
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
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FaCheckCircle style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#28a745' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Booked</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#28a745' }}>
              {events.filter(e => isEventBooked(e)).length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FaUser style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#667eea' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Your House</h3>
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

        {/* Events List */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Society Events</h2>
          
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪</div>
              <p>No events found for the selected filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredEvents.map((event) => {
                const status = getEventStatus(event);
                return (
                  <div key={event._id} style={{ 
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
                    if (isEventUpcoming(event) && !isEventBooked(event) && !isEventFull(event)) {
                      setSelectedEvent(event);
                      setShowBookingModal(true);
                    }
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div style={{ 
                            fontSize: '2rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: 'var(--color-primary)'
                          }}>
                            🎉
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                              {event.name}
                            </div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                              📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ 
                          padding: '1rem',
                          background: 'var(--color-primary)',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ color: '#666', lineHeight: '1.5' }}>
                            {event.description}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
                          <span>👥 Capacity: {event.capacity}</span>
                          <span>🎫 Booked: {event.bookedUsers?.length || 0}</span>
                          <span>💰 Price: {event.ticketPrice === 0 ? 'Free' : `Rs. ${event.ticketPrice}`}</span>
                          <span>⏰ {getDaysUntilEvent(event.date)}</span>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: status.color,
                          color: 'white',
                          display: 'inline-block',
                          marginBottom: '0.5rem'
                        }}>
                          {status.label}
                        </div>
                        
                        {isEventBooked(event) && (
                          <div style={{ 
                            fontSize: '0.8rem',
                            color: '#28a745',
                            fontWeight: '600'
                          }}>
                            ✅ You're booked!
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isEventUpcoming(event) && !isEventBooked(event) && !isEventFull(event) && (
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
                        🎫 Click to Book Now
                      </div>
                    )}
                    
                    {isEventFull(event) && !isEventBooked(event) && (
                      <div style={{ 
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: '#dc3545',
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}>
                        🚫 Fully Booked
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedEvent && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
              🎫 Book Event
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {selectedEvent.name}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                📅 {new Date(selectedEvent.date).toLocaleDateString()}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                📍 {selectedEvent.location}
              </div>
              
              <div style={{ 
                padding: '1rem',
                background: 'var(--color-primary)',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {selectedEvent.description}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                <span>👥 Capacity: {selectedEvent.capacity}</span>
                <span>🎫 Booked: {selectedEvent.bookedUsers?.length || 0}</span>
                <span>💰 Price: {selectedEvent.ticketPrice === 0 ? 'Free' : `Rs. ${selectedEvent.ticketPrice}`}</span>
              </div>

              {/* Balance Information for Paid Events */}
              {selectedEvent.ticketPrice > 0 && (
                <div style={{ 
                  padding: '1rem',
                  background: 'var(--color-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-primary)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontWeight: '600', color: '#856404', marginBottom: '0.5rem' }}>
                    💰 Payment Information
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#856404' }}>
                    <div>Current Balance: Rs. {userProfile?.balance || 0}</div>
                    <div>Ticket Price: Rs. {selectedEvent.ticketPrice}</div>
                    <div style={{ fontWeight: '600', marginTop: '0.5rem' }}>
                      Balance After Booking: Rs. {(userProfile?.balance || 0) - selectedEvent.ticketPrice}
                    </div>
                    {(userProfile?.balance || 0) < selectedEvent.ticketPrice && (
                      <div style={{ color: '#dc3545', fontWeight: '600', marginTop: '0.5rem' }}>
                        ⚠️ Insufficient balance! You need to add more funds.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleBooking}
                disabled={selectedEvent.ticketPrice > 0 && (userProfile?.balance || 0) < selectedEvent.ticketPrice}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: selectedEvent.ticketPrice > 0 && (userProfile?.balance || 0) < selectedEvent.ticketPrice
                    ? 'var(--color-disabled)'
                    : 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: selectedEvent.ticketPrice > 0 && (userProfile?.balance || 0) < selectedEvent.ticketPrice ? 'not-allowed' : 'pointer',
                  opacity: selectedEvent.ticketPrice > 0 && (userProfile?.balance || 0) < selectedEvent.ticketPrice ? 0.6 : 1
                }}
              >
                {selectedEvent.ticketPrice > 0 && (userProfile?.balance || 0) < selectedEvent.ticketPrice 
                  ? '❌ Insufficient Balance' 
                  : '🎫 Confirm Booking'
                }
              </button>
              
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedEvent(null);
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

export default Events; 