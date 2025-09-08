import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './EventLanding.module.css';

const EventLanding = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('current'); // 'current' or 'past'
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://hohoindiabackend.onrender.com/api/events/public', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      let eventsData = [];
      if (data.success && data.events && Array.isArray(data.events)) eventsData = data.events;
      else if (data.events && Array.isArray(data.events)) eventsData = data.events;
      else if (Array.isArray(data.data)) eventsData = data.data;
      else if (Array.isArray(data)) eventsData = data;
      if (!Array.isArray(eventsData)) eventsData = [];

      const processedEvents = processAndSortEvents(eventsData);
      setEvents(processedEvents);
    } catch (error) {
      setError('Unable to load events. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const processAndSortEvents = (eventsData) => {
    if (!Array.isArray(eventsData) || eventsData.length === 0) return [];

    const currentDate = new Date();
    const fiveDaysAgo = new Date(currentDate.getTime() - (5 * 24 * 60 * 60 * 1000));

    const filteredEvents = eventsData.filter(event => {
      if (!event || !event.date) return false;
      const eventDate = new Date(event.date);
      if (isNaN(eventDate.getTime())) return false;
      const hasEnded = eventDate < currentDate;
      if (hasEnded) return eventDate >= fiveDaysAgo;
      return true;
    });

    const upcomingEvents = [];
    const endedEvents = [];

    filteredEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const hasEnded = eventDate < currentDate;
      if (hasEnded) endedEvents.push({ ...event, status: 'ended' });
      else upcomingEvents.push({ ...event, status: 'upcoming' });
    });

    const sortedUpcoming = upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    const sortedEnded = endedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    return [...sortedUpcoming, ...sortedEnded];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);

    if (isNaN(event.getTime())) {
      return { label: 'Invalid Date', className: styles.statusError };
    }

    if (event < today) {
      const diffTime = Math.abs(today - event);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { label: `Ended ${diffDays} day${diffDays > 1 ? 's' : ''} ago`, className: styles.statusEnded };
    } else if (event.toDateString() === today.toDateString()) {
      return { label: 'Today', className: styles.statusToday };
    } else {
      const diffTime = Math.abs(event - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        return { label: `${diffDays} day${diffDays > 1 ? 's' : ''} left`, className: styles.statusSoon };
      }
      return { label: 'Upcoming', className: styles.statusUpcoming };
    }
  };

  const getRegistrationCount = (event) =>
    (event.registrations && Array.isArray(event.registrations)) ? event.registrations.length : 0;

  const handleRegisterClick = (eventId) => {
    if (eventId) {
      navigate(`/register/${eventId}`);
    }
  };

  const getCreatorInfo = (event) => {
    if (event.organizer) return event.organizer.name || event.organizer.email || 'Event Manager';
    if (event.createdBy) return event.createdBy.name || event.createdBy.email || 'Event Manager';
    return 'Event Manager';
  };

  const handleRetry = () => {
    setError('');
    fetchAllEvents();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading all public events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>🚫 Unable to Load Events</h2>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={handleRetry} className={styles.retryBtn}>🔄 Try Again</button>
            <Link to="/" className={styles.homeBtn}>🏠 Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const endedEvents = events.filter(event => event.status === 'ended');
  const currentEvents = activeView === 'current' ? upcomingEvents : endedEvents;

  const renderEventCard = (event, isEnded = false) => {
    if (!event || !event._id) return null;
    const status = getEventStatus(event.date);
    const registrationCount = getRegistrationCount(event);
    return (
      <div key={event._id} className={`${styles.eventCard} ${isEnded ? styles.endedEventCard : ''}`}>
        <div className={styles.eventImage}>
          {event.logoUrl ? (
            <img
              src={`https://hohoindiabackend.onrender.com${event.logoUrl}`}
              alt={event.title || 'Event'}
              onError={e => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={styles.imagePlaceholder}>
            {event.title ? event.title.charAt(0).toUpperCase() : '?'}
          </div>
        </div>

        <div className={`${styles.statusBadge} ${status.className}`}>{status.label}</div>

        {registrationCount > 0 && (
          <div className={styles.registrationBadge}>
            {registrationCount} {isEnded ? 'attended' : 'registered'}
          </div>
        )}

        <div className={styles.eventContent}>
          <h3 className={styles.eventTitle}>{event.title || 'Untitled Event'}</h3>
          <div className={styles.creatorInfo}>
            <span className={styles.creatorLabel}>Organized by:</span>
            <span className={styles.creatorName}>{getCreatorInfo(event)}</span>
          </div>
          <div className={styles.eventDetails}>
            <div className={styles.detailItem}>
              <span className={styles.icon}>📅</span>
              <span>{formatDate(event.date)}</span>
            </div>
            {event.time && (
              <div className={styles.detailItem}>
                <span className={styles.icon}>🕒</span>
                <span>{event.time}</span>
              </div>
            )}
            {event.venue && (
              <div className={styles.detailItem}>
                <span className={styles.icon}>📍</span>
                <span className={styles.venue}>{event.venue}</span>
              </div>
            )}
            {event.capacity && (
              <div className={styles.detailItem}>
                <span className={styles.icon}>👥</span>
                <span>{event.capacity} seats</span>
              </div>
            )}
          </div>
          <p className={styles.eventDescription}>
            {event.description && event.description.length > 120 
              ? `${event.description.substring(0, 120)}...` 
              : event.description || 'No description available'
            }
          </p>
          {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
            <div className={styles.speakersInfo}>
              <span className={styles.icon}>🎤</span>
              <span>{event.speakers.length} Speaker{event.speakers.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* ---👇 यहां केवल Register Now button सभी को --- */}
        <div className={styles.eventActions}>
          {isEnded ? (
            <button className={styles.pastEventBtn} disabled>
              Event Ended
            </button>
          ) : (
            <button
              onClick={() => handleRegisterClick(event._id)}
              className={styles.registerBtn}
            >
              Register Now
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>All Events</h1>
        <p>Discover public events and register to attend</p>
        {events.length > 0 && (
          <>
            <div className={styles.eventStats}>
              <span className={styles.statItem}>📅 {upcomingEvents.length} Upcoming</span>
              <span className={styles.statItem}>✅ {endedEvents.length} Recently Ended</span>
              <span className={styles.statItem}>🎉 {events.length} Total Events</span>
            </div>
            <div className={styles.eventToggle}>
              <button
                className={`${styles.toggleBtn} ${activeView === 'current' ? styles.activeToggle : ''}`}
                onClick={() => setActiveView('current')}
              >
                Current Events
                <span className={styles.toggleCount}>({upcomingEvents.length})</span>
              </button>
              <button
                className={`${styles.toggleBtn} ${activeView === 'past' ? styles.activeToggle : ''}`}
                onClick={() => setActiveView('past')}
              >
                Past Events
                <span className={styles.toggleCount}>({endedEvents.length})</span>
              </button>
            </div>
          </>
        )}
      </div>
      {events.length === 0 ? (
        <div className={styles.noEvents}>
          <h2>📅 No Public Events Available</h2>
          <p>There are currently no public events to display.</p>
          <div className={styles.noEventsActions}>
            <Link to="/" className={styles.homeBtn}>🏠 Go Home</Link>
          </div>
        </div>
      ) : (
        <>
          {currentEvents.length > 0 ? (
            <div className={styles.eventsSection}>
              <div className={styles.eventsGrid}>
                {currentEvents.map((event) => renderEventCard(event, activeView === 'past'))}
              </div>
            </div>
          ) : (
            <div className={styles.noCurrentEvents}>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>{activeView === 'current' ? '📅' : '📋'}</div>
                <h3>{activeView === 'current' ? 'No Upcoming Events' : 'No Past Events'}</h3>
                <p>{activeView === 'current'
                  ? 'There are no upcoming events at the moment.'
                  : 'No recently ended events to display.'}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default EventLanding;
