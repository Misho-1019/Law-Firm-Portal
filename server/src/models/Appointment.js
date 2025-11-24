// src/models/Appointment.js
import { Schema, model, Types } from "mongoose";
import { toSofiaISO } from "../lib/time.js"; // 👈 uses the helper we wrote earlier

const appointmentSchema = new Schema(
  {
    creator: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    // Snapshot of who created the appointment (do not use for auth; use req.user.role)
    role: {
      type: String,
      enum: ["Admin", "Client"],
      default: "Client",
    },

    service: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    mode: {
      type: String,
      required: true,
      enum: ["In-Person", "Online"],
    },

    // Stored as UTC in DB (do not change this)
    startsAt: {
      type: Date,
      required: true,
      index: true,
    },

    durationMin: { 
      type: Number, 
      min: 15, 
      max: 480, 
      required: true, 
      default: 120 
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DECLINED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },

    notes: { type: String, trim: true },

    reminders: {
      // Stored as UTC; we’ll format to Sofia on output
      send24hAt: { type: Date, index: true }, // startsAt - 24h
      sent24hAt: { type: Date, default: null },
      send1hAt:  { type: Date, index: true }, // startsAt - 1h
      sent1hAt:  { type: Date, default: null },
    },
  },
  {
    timestamps: true,        // createdAt / updatedAt (UTC in DB)
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // keep your existing shaping
        ret.id = ret._id.toString();
        delete ret._id;

        // 👇 convert all date fields to Sofia local: "YYYY-MM-DDTHH:mm:ss"
        ret.startsAt  = toSofiaISO(ret.startsAt);
        ret.createdAt = toSofiaISO(ret.createdAt);
        ret.updatedAt = toSofiaISO(ret.updatedAt);

        if (ret.reminders) {
          ret.reminders.send24hAt = toSofiaISO(ret.reminders.send24hAt);
          ret.reminders.sent24hAt = toSofiaISO(ret.reminders.sent24hAt);
          ret.reminders.send1hAt  = toSofiaISO(ret.reminders.send1hAt);
          ret.reminders.sent1hAt  = toSofiaISO(ret.reminders.sent1hAt);
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        // mirror the same transform for toObject (useful in some code paths)
        ret.id = ret._id.toString();
        delete ret._id;

        ret.startsAt  = toSofiaISO(ret.startsAt);
        ret.createdAt = toSofiaISO(ret.createdAt);
        ret.updatedAt = toSofiaISO(ret.updatedAt);

        if (ret.reminders) {
          ret.reminders.send24hAt = toSofiaISO(ret.reminders.send24hAt);
          ret.reminders.sent24hAt = toSofiaISO(ret.reminders.sent24hAt);
          ret.reminders.send1hAt  = toSofiaISO(ret.reminders.send1hAt);
          ret.reminders.sent1hAt  = toSofiaISO(ret.reminders.sent1hAt);
        }
        return ret;
      },
    },
  }
);

// Recompute reminder targets when startsAt changes; reset sent flags
appointmentSchema.pre("save", function () {});

// Indexes
appointmentSchema.index({ startsAt: 1 }, { unique: true });      // one booking per slot
appointmentSchema.index({ status: 1, startsAt: 1 });              // admin lists
appointmentSchema.index({ creator: 1, startsAt: 1 });             // owner lists
appointmentSchema.index({ "reminders.send24hAt": 1 });            // 24h scheduler
appointmentSchema.index({ "reminders.send1hAt": 1 });             // 1h scheduler
appointmentSchema.index({ role: 1 });                             // optional

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
