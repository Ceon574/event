import React, { useState } from 'react';

function EventTable({ events, onDelete, onEdit, loading }) {
  const [deleteModal, setDeleteModal] = useState({ open: false, event: null });
  const [deleting, setDeleting] = useState(false);

  const openDeleteModal = (event) => setDeleteModal({ open: true, event });
  const closeDeleteModal = () => setDeleteModal({ open: false, event: null });

  const confirmDelete = async () => {
    if (!deleteModal.event) return;
    setDeleting(true);
    await onDelete(deleteModal.event._id);
    setDeleting(false);
    closeDeleteModal();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const shortId = (id) => id?.slice(-6).toUpperCase() || '—';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No Events Found</h3>
        <p>There are no events to display. Start by adding a new event.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="event-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Registrations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>
                  <span className="event-id-badge">#{shortId(event._id)}</span>
                </td>
                <td>
                  <div className="event-name-cell">
                    <span className="event-name">{event.eventName}</span>
                    {event.eventDescription && (
                      <span className="event-desc">{event.eventDescription.slice(0, 50)}{event.eventDescription.length > 50 ? '…' : ''}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`date-badge ${new Date(event.eventDate) >= new Date() ? 'upcoming' : 'past'}`}>
                    {formatDate(event.eventDate)}
                  </span>
                </td>
                <td>{event.venue}</td>
                <td>
                  <span className="reg-count">{event.totalRegistrations ?? 0}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() => onEdit(event._id)}
                      title="Edit Event"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => openDeleteModal(event)}
                      title="Delete Event"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Delete Event?</h3>
            <p className="modal-message">
              Are you sure you want to delete{' '}
              <strong>"{deleteModal.event?.eventName}"</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeDeleteModal} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventTable;
