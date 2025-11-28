// models/TimeOff.js
import { Schema, model } from "mongoose";

const timeOffSchema = new Schema(
  {
    // Inclusive start date, ISO "YYYY-MM-DD" in Europe/Sofia
    dateFrom: {
      type: String,
      required: true,
    },

    // Inclusive end date, ISO "YYYY-MM-DD" in Europe/Sofia
    dateTo: {
      type: String,
      required: true,
    },

    // Optional partial-day window (HH:MM, 24h)
    // If omitted -> treat as full-day block for those dates
    from: {
      type: String, // e.g. "09:00"
    },

    to: {
      type: String, // e.g. "17:00"
    },

    reason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Simple range index: allows fast lookups by date interval
timeOffSchema.index({ dateFrom: 1, dateTo: 1 });

const TimeOff = model("TimeOff", timeOffSchema);

export default TimeOff;
