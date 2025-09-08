import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ClientRegistration.module.css';

const ClientRegistration = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // ❌ कोई भी auth check या redirect logic नहीं होनी चाहिए
  // ✅ केवल event fetch करें
  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      console.log('Fetching event for registration:', eventId);
      
      // PUBLIC API call - no auth required (Production URL)
      const response = await fetch(`https://hohobackend.onrender.com/api/events/public/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.event) {
        setEvent(data.event);
      } else {
        throw new Error('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // PUBLIC registration call - no auth required (Production URL)
      const response = await fetch(`https://hohobackend.onrender.com/api/registrations/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loading}>Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.error}>
          <h2>Event Not Found</h2>
          <p>{error}</p>
          <Link to="/all-events" className={styles.backBtn}>
            ← Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.eventCard}>
        <h1 className={styles.eventTitle}>{event.title}</h1>
        <div className={styles.eventMeta}>
          <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString('en-IN')}</p>
          <p><strong>🕒 Time:</strong> {event.time}</p>
          <p><strong>📍 Venue:</strong> {event.venue}</p>
        </div>
        <p className={styles.eventDescription}>{event.description}</p>
      </div>

      <div className={styles.formWrapper}>
        {success ? (
          <div className={styles.successMessage}>
            <h2>🎉 Registration Successful!</h2>
            <p>Thank you for registering for <strong>{event.title}</strong>!</p>
            <Link to="/all-events" className={styles.backBtn}>
              ← View All Events
            </Link>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Register for this Event</h2>
            
            {error && (
              <div className={styles.errorBox}>❌ {error}</div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={submitting} className={styles.submitBtn}>
                {submitting ? 'Registering...' : 'Register Now'}
              </button>
              <Link to="/all-events" className={styles.cancelBtn}>
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};



export default ClientRegistration;
