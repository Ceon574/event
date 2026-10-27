import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EventTable from '../components/EventTable';
import { getAllEvents, deleteEvent } from '../services/api';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <h2 className="stat-value">{value}</h2>
      </div>
    </div>
  );
}

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAllEvents();
      const data = res.data.data || [];
      setEvents(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch events. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      events.filter(
        (e) =>
          e.eventName.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      )
    );
  }, [search, events]);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      const updated = events.filter((e) => e._id !== id);
      setEvents(updated);
      showNotification('Event deleted successfully!', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to delete event.', 'error');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-event/${id}`);
  };

  // Stats
  const total = events.length;
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.eventDate) >= now).length;
  const totalRegs = events.reduce((sum, e) => sum + (e.totalRegistrations || 0), 0);

  return (
    <div className="page-container">
      {/* Notification */}
      {notification && (
        <div className={`notification notification--${notification.type}`}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Manage and monitor all your events</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-event')}>
          ➕ Add New Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard icon="🎪" label="Total Events" value={total} color="blue" />
        <StatCard icon="🗓️" label="Upcoming Events" value={upcoming} color="purple" />
        <StatCard icon="👥" label="Total Registrations" value={totalRegs} color="green" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert--error">
          <span>❌</span>
          <span>{error}</span>
          <button className="alert-retry" onClick={fetchEvents}>Retry</button>
        </div>
      )}

      {/* Events Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Events</h2>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or venue…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')} title="Clear search">
                ✕
              </button>
            )}
          </div>
        </div>

        {search && !loading && (
          <p className="search-results-info">
            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
        )}

        <EventTable
          events={filtered}
          onDelete={handleDelete}
          onEdit={handleEdit}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Dashboard;
