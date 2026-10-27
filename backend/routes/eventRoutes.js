const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');

// Helper: validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/events — Retrieve all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events',
      error: error.message,
    });
  }
});

// GET /api/events/:id — Retrieve one event
router.get('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid event ID format' });
  }
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event',
      error: error.message,
    });
  }
});

// POST /api/events — Create an event
router.post('/', async (req, res) => {
  const { eventName, eventDescription, eventDate, venue, totalRegistrations } = req.body;
  if (!eventName || !eventDescription || !eventDate || !venue) {
    return res.status(400).json({
      success: false,
      message: 'Please provide eventName, eventDescription, eventDate, and venue',
    });
  }
  try {
    const event = await Event.create({
      eventName: eventName.trim(),
      eventDescription: eventDescription.trim(),
      eventDate,
      venue: venue.trim(),
      totalRegistrations: totalRegistrations !== undefined ? Number(totalRegistrations) : 0,
    });
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating event',
      error: error.message,
    });
  }
});

// PUT /api/events/:id — Update an event
router.put('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid event ID format' });
  }
  const { eventName, eventDescription, eventDate, venue, totalRegistrations } = req.body;
  if (!eventName || !eventDescription || !eventDate || !venue) {
    return res.status(400).json({
      success: false,
      message: 'Please provide eventName, eventDescription, eventDate, and venue',
    });
  }
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        eventName: eventName.trim(),
        eventDescription: eventDescription.trim(),
        eventDate,
        venue: venue.trim(),
        totalRegistrations: totalRegistrations !== undefined ? Number(totalRegistrations) : 0,
      },
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating event',
      error: error.message,
    });
  }
});

// DELETE /api/events/:id — Delete an event
router.delete('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid event ID format' });
  }
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event',
      error: error.message,
    });
  }
});

module.exports = router;
