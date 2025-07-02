import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    capacity: '',
    ticketType: 'free',
    ticketPrice: ''
  });

  useEffect(() => {
    fetchEvents();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        ticketPrice: formData.ticketType === 'free' ? 0 : parseFloat(formData.ticketPrice)
      };

      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, eventData);
        alert('Event updated successfully!');
      } else {
        await api.post('/admin/events', eventData);
        alert('Event created successfully!');
      }
      
      setFormData({
        name: '',
        date: '',
        location: '',
        description: '',
        capacity: '',
        ticketType: 'free',
        ticketPrice: ''
      });
      setShowAddForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      alert('Error saving event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date.split('T')[0],
      location: event.location,
      description: event.description,
      capacity: event.capacity,
      ticketType: event.ticketPrice === 0 ? 'free' : 'paid',
      ticketPrice: event.ticketPrice === 0 ? '' : event.ticketPrice.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/admin/events/${eventId}`);
        alert('Event deleted successfully!');
        fetchEvents();
      } catch (error) {
        alert('Error deleting event');
      }
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: '',
      date: '',
      location: '',
      description: '',
      capacity: '',
      ticketType: 'free',
      ticketPrice: ''
    });
    setShowAddForm(false);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f7fafd'
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2rem', 
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading event management... ⏳
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd' }}>
      <AdminSidebar />
      <div style={{
        marginLeft: '80px',
        padding: '2rem',
        maxWidth: '1200px',
        marginRight: 'auto',
        marginLeft: '100px',
        transition: 'margin-left 0.3s',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(102,126,234,0.07)',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ 
            margin: 0,
            fontSize: '2.2rem',
            color: '#222',
            fontWeight: 700,
            letterSpacing: '-1px',
          }}>
            Event Management
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: '1.1rem' }}>
            Create and manage society events
          </p>
        </div>

        {/* Add Event Button */}
        <div className="card" style={{ 
          padding: '1rem',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ➕ Create New Event
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card animate-fade-in" style={{ 
            padding: '2rem',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Event Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    min="1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Ticket Type
                  </label>
                  <select
                    value={formData.ticketType}
                    onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                
                {formData.ticketType === 'paid' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                      Ticket Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                      required={formData.ticketType === 'paid'}
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'rgba(255,255,255,0.8)',
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
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Society Events</h2>
          
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪</div>
              <p>No events found. Create your first event!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {events.map((event) => (
                <div key={event._id} style={{ 
                  padding: '1.5rem',
                  border: '1px solid #e1e5e9',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.8)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                        {event.name}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        {event.description}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                        <span>👥 Capacity: {event.capacity}</span>
                        <span>🎫 Booked: {event.bookedUsers?.length || 0}</span>
                        <span>💰 Price: {event.ticketPrice === 0 ? 'Free' : `Rs. ${event.ticketPrice}`}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(event)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #ffc107 0%, #ffca2c 100%)',
                          color: '#333',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(event._id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: new Date(event.date) > new Date() ? '#28a745' : '#6c757d',
                    color: 'white',
                    display: 'inline-block'
                  }}>
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past Event'}
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

export default AdminEvents; 