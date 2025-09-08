import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { createEvent } from '../../redux/slices/eventSlice';
import styles from './CreateEvent.module.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', date: new Date(),
    time: '', venue: '', capacity: '',
    logo: null,      // Only logo here
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(s => s.events);

  /* Generic change handler */
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* For date picker */
  const handleDateChange = date =>
    setFormData({ ...formData, date });

  /* For logo file */
  const handleLogo = e =>
    setFormData({ ...formData, logo: e.target.files[0] });

  /* On form submit */
  const handleSubmit = async e => {
    e.preventDefault();

    const fd = new FormData();
    if (formData.logo) {
      fd.append('logo', formData.logo);
    }

    // Put all other form data in JSON string
    fd.append('data', JSON.stringify({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      capacity: parseInt(formData.capacity),
    }));

    try {
      const result = await dispatch(createEvent(fd)).unwrap();
      navigate(`/event/${result.event._id}`);
    } catch (err) {
      console.error('Event creation failed:', err);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Create New Event</h2>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label>Event Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Event Date</label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className={styles.datePicker}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Event Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Venue</label>
          <input
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Event Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogo}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? 'Creating…' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
