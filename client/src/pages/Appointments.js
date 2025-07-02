import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navigation from '../components/Navigation';
import { FaUserMd, FaHeartbeat, FaBrain, FaChild, FaEye, FaTooth, FaBone, FaAllergies, FaLungs, FaVial, FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

function Appointments() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [userProfile, setUserProfile] = useState(null);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const specializationIcons = {
    'General Medicine': FaUserMd,
    'Cardiology': FaHeartbeat,
    'Neurology': FaBrain,
    'Pediatrics': FaChild,
    'Ophthalmology': FaEye,
    'Dentistry': FaTooth,
    'Orthopedics': FaBone,
    'Dermatology': FaAllergies,
    'Pulmonology': FaLungs,
    'Pathology': FaVial
  };

  const tabs = [
    { id: 'all', label: 'All Appointments', icon: FaClipboardList },
    { id: 'upcoming', label: 'Upcoming', icon: FaClock },
    { id: 'past', label: 'Completed', icon: FaCheckCircle },
    { id: 'cancelled', label: 'Cancelled', icon: MdCancel }
  ];

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchUserProfile();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
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
      await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        date: bookingData.date,
        time: bookingData.time,
        reason: bookingData.reason
      });
      alert('Appointment booked successfully!');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setBookingData({ date: '', time: '', reason: '' });
      fetchAppointments();
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/appointments/${appointmentId}/cancel`);
        alert('Appointment cancelled successfully!');
        fetchAppointments();
      } catch (error) {
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const isAppointmentUpcoming = (appointment) => {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    return appointmentDateTime > new Date() && appointment.status !== 'cancelled';
  };

  const isAppointmentPast = (appointment) => {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    return appointmentDateTime < new Date();
  };

  const getFilteredAppointments = () => {
    switch (filter) {
      case 'upcoming':
        return appointments.filter(appointment => isAppointmentUpcoming(appointment));
      case 'past':
        return appointments.filter(appointment => isAppointmentPast(appointment));
      case 'cancelled':
        return appointments.filter(appointment => appointment.status === 'cancelled');
      default:
        return appointments;
    }
  };

  const getAppointmentStatus = (appointment) => {
    if (appointment.status === 'cancelled') return { status: 'cancelled', label: 'Cancelled', color: '#dc3545', icon: MdCancel };
    if (isAppointmentPast(appointment)) return { status: 'completed', label: 'Completed', color: '#28a745', icon: FaCheckCircle };
    return { status: 'upcoming', label: 'Upcoming', color: '#17a2b8', icon: FaClock };
  };

  const getDaysUntilAppointment = (appointmentDate) => {
    const days = Math.ceil((new Date(appointmentDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Past';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const getSpecializationIcon = (specialization) => {
    const Icon = specializationIcons[specialization] || FaUserMd;
    return <Icon style={{ fontSize: '2rem', color: '#667eea' }} />;
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
          Loading appointments... <FaClock />
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

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
          <FaUserMd style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-accent)' }} />
          <h1 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '2.5rem' }}>
            Appointments
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>
            Book and manage your appointments
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
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaUserMd style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Available Doctors</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {doctors.length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaCalendarAlt style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Total Appointments</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {appointments.length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaClock style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Upcoming</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {appointments.filter(a => isAppointmentUpcoming(a)).length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaCheckCircle style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Completed</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {appointments.filter(a => isAppointmentPast(a)).length}
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

        {/* Appointments List */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Your Appointments</h2>
          
          {filteredAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <p>No appointments found for the selected filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredAppointments.map((appointment) => {
                const status = getAppointmentStatus(appointment);
                return (
                  <div key={appointment._id} style={{ 
                    padding: '1.5rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    background: 'var(--color-surface)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          fontSize: '2rem',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          background: 'var(--color-surface)'
                        }}>
                          {getSpecializationIcon(appointment.doctorSpecialization || 'General Medicine')}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                            Dr. {appointment.doctorName}
                          </div>
                          <div style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                            {appointment.doctorSpecialization || 'General Medicine'}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: status.color,
                          color: 'var(--color-text)',
                          display: 'inline-block',
                          marginBottom: '0.5rem'
                        }}>
                          {status.label}
                        </div>
                        
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>
                          {getDaysUntilAppointment(appointment.date)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '1rem',
                      background: 'var(--color-surface)',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                        <span>📅 Date: {new Date(appointment.date).toLocaleDateString()}</span>
                        <span>⏰ Time: {appointment.time}</span>
                      </div>
                      
                      {appointment.reason && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--color-text)' }}>
                            Reason for Visit:
                          </div>
                          <div style={{ color: 'var(--color-text)' }}>
                            {appointment.reason}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {isAppointmentUpcoming(appointment) && (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => cancelAppointment(appointment._id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--color-accent)',
                            color: 'var(--color-text)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}
                        >
                          ❌ Cancel Appointment
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Doctors */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          marginTop: '2rem'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Available Doctors</h2>
          
          {doctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
              <p>No doctors available at the moment.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {doctors.map((doctor) => (
                <div key={doctor._id} style={{ 
                  padding: '1.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  background: 'var(--color-surface)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 'var(--box-shadow)'
                  }
                }} onClick={() => {
                  setSelectedDoctor(doctor);
                  setShowBookingModal(true);
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ 
                      fontSize: '3rem',
                      marginBottom: '0.5rem'
                    }}>
                      {getSpecializationIcon(doctor.specialization)}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      Dr. {doctor.name}
                    </div>
                    <div style={{ color: 'var(--color-text)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {doctor.specialization}
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '1rem',
                    background: 'var(--color-surface)',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--color-text)' }}>Experience:</span>
                      <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>
                        {doctor.experience} years
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--color-text)' }}>Phone:</span>
                      <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>
                        {doctor.phone}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--color-accent)',
                      color: 'var(--color-text)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    📅 Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
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
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)', textAlign: 'center' }}>
              📅 Book Appointment
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Dr. {selectedDoctor.name}
              </div>
              <div style={{ color: 'var(--color-text)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {selectedDoctor.specialization} • {selectedDoctor.experience} years experience
              </div>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text)' }}>
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text)' }}>
                  Preferred Time
                </label>
                <select
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text)' }}>
                  Reason for Visit
                </label>
                <textarea
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                  rows="3"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--color-accent)',
                    color: 'var(--color-text)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📅 Confirm Booking
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedDoctor(null);
                    setBookingData({ date: '', time: '', reason: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
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
        </div>
      )}
    </div>
  );
}

export default Appointments;