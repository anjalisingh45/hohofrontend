import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../../redux/slices/eventSlice';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.welcomeHeading}>Welcome, {user?.name}</h1>
        <Link to="/create-event" className={styles.createBtn}>
          Create Event
        </Link>
      </div>

      <div className={styles.eventsGrid}>
        {events.length === 0 ? (
          <div className={styles.noEvents}>
            <p>No events created yet</p>
            <Link to="/create-event" className={styles.createBtn}>
              Create Your First Event
            </Link>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className={styles.eventCard}>
              {event.logoUrl && (
                <img
                  src={`https://hohoindiabackend.onrender.com${event.logoUrl}`}
                  alt={`${event.title} logo`}
                  className={styles.eventLogo}
                />
              )}
              <h3>{event.title}</h3>
              <p className={styles.eventDate}>
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
              <p className={styles.eventVenue}>{event.venue}</p>
              <p className={styles.eventCapacity}>
                Capacity: {event.capacity} people
              </p>
              <div className={styles.eventActions}>
                <Link to={`/event/${event._id}`} className={styles.viewBtn}>
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
