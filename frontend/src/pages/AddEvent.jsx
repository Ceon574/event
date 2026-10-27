import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEventById } from '../services/api';

const initialForm = {
  eventName: '',
  eventDescription: '',
  eventDate: '',
  venue: '',
  totalRegistrations: 0,
};

function AddEvent() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Load existing event data when editing
  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          setLoadingEvent(true);
          const res = await getEventById(id);
          const ev = res.data.data;
          // Format date for input[type=date]
          const formatted = ev.eventDate
            ? new Date(ev.eventDate).toISOString().split('T')[0]
            : '';
          setForm({
            eventName: ev.eventName || '',
            eventDescription: ev.eventDescription || '',
            eventDate: formatted,
            venue: ev.venue || '',
            totalRegistrations: ev.totalRegistrations ?? 0,
          });
        } catch (err) {
          setApiError(err.message || 'Failed to load event data.');
        } finally {
          setLoadingEvent(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!form.eventName.trim()) newErrors.eventName = 'Event name is required.';
    else if (form.eventName.trim().length < 3) newErrors.eventName = 'Event name must be at least 3 characters.';

    if (!form.eventDescription.trim()) newErrors.eventDescription = 'Event description is required.';
    else if (form.eventDescription.trim().length < 10) newErrors.eventDescription = 'Description must be at least 10 characters.';

    if (!form.eventDate) newErrors.eventDate = 'Event date is required.';

    if (!form.venue.trim()) newErrors.venue = 'Venue is required.';

    if (form.totalRegistrations < 0) newErrors.totalRegistrations = 'Registrations cannot be negative.';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'totalRegistrations' ? Number(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setSubmitting(true);
      setApiError('');
      if (isEdit) {
        await updateEvent(id, form);
        showNotification('Event updated successfully!', 'success');
      } else {
        await createEvent(form);
        showNotification('Event created successfully!', 'success');
      }
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {notification && (
        <div className={`notification notification--${notification.type}`}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Event' : 'Add New Event'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update the details of the existing event.' : 'Fill in the details to create a new event.'}
          </p>
        </div>
      </div>

      <div className="form-card">
        {apiError && (
          <div className="alert alert--error">
            <span>❌</span>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Event Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="eventName">
              Event Name <span className="required">*</span>
            </label>
            <input
              id="eventName"
              type="text"
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              className={`form-input ${errors.eventName ? 'input-error' : ''}`}
              placeholder="e.g. Annual Tech Conference 2026"
              maxLength={100}
            />
            {errors.eventName && <span className="error-msg">{errors.eventName}</span>}
          </div>

          {/* Event Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="eventDescription">
              Event Description <span className="required">*</span>
            </label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              value={form.eventDescription}
              onChange={handleChange}
              className={`form-input form-textarea ${errors.eventDescription ? 'input-error' : ''}`}
              placeholder="Provide a detailed description of the event…"
              rows={4}
              maxLength={500}
            />
            <span className="char-count">{form.eventDescription.length}/500</span>
            {errors.eventDescription && <span className="error-msg">{errors.eventDescription}</span>}
          </div>

          {/* Two-column row: Date and Venue */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="eventDate">
                Event Date <span className="required">*</span>
              </label>
              <input
                id="eventDate"
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className={`form-input ${errors.eventDate ? 'input-error' : ''}`}
              />
              {errors.eventDate && <span className="error-msg">{errors.eventDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="venue">
                Venue <span className="required">*</span>
              </label>
              <input
                id="venue"
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                className={`form-input ${errors.venue ? 'input-error' : ''}`}
                placeholder="e.g. City Convention Center, Hall A"
                maxLength={200}
              />
              {errors.venue && <span className="error-msg">{errors.venue}</span>}
            </div>
          </div>

          {/* Total Registrations */}
          <div className="form-group" style={{ maxWidth: '200px' }}>
            <label className="form-label" htmlFor="totalRegistrations">
              Total Registrations
            </label>
            <input
              id="totalRegistrations"
              type="number"
              name="totalRegistrations"
              value={form.totalRegistrations}
              onChange={handleChange}
              className={`form-input ${errors.totalRegistrations ? 'input-error' : ''}`}
              min={0}
            />
            {errors.totalRegistrations && <span className="error-msg">{errors.totalRegistrations}</span>}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={submitting}
            >
              ✕ Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? isEdit ? 'Saving…' : 'Creating…'
                : isEdit ? '💾 Save Changes' : '➕ Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
