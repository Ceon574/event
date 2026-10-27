const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [100, 'Event name cannot exceed 100 characters'],
    },
    eventDescription: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [500, 'Event description cannot exceed 500 characters'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      maxlength: [200, 'Venue cannot exceed 200 characters'],
    },
    totalRegistrations: {
      type: Number,
      default: 0,
      min: [0, 'Total registrations cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
