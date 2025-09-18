import { Schema, model, Types } from "mongoose";

const appointmentSchema = new Schema(
  {
    creator: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      enum: ["In-Person", "Online"], // if your API uses lowercase, align here too
    },
    startsAt: {
      type: Date,
      required: true, // UTC
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DECLINED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    reminders: {
      send24hAt: { type: Date },           // computed: startsAt - 24h
      sent24hAt: { type: Date, default: null },
      send1hAt:  { type: Date },           // computed: startsAt - 1h
      sent1hAt:  { type: Date, default: null },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// Recompute reminder targets when startsAt changes; reset sent flags
appointmentSchema.pre("save", function () {
  if (this.isModified("startsAt")) {
    const start = this.startsAt instanceof Date ? this.startsAt : new Date(this.startsAt);
    const time = start.getTime();
    if (!this.reminders) {
      this.reminders = {};
    }
    this.reminders.send24hAt = new Date(time - 24 * 60 * 60 * 1000);
    this.reminders.send1hAt = new Date(time - 60 * 60 * 1000);
    this.reminders.sent24hAt = null;
    this.reminders.sent1hAt = null;
  }
});

// Indexes
appointmentSchema.index({ startsAt: 1 }, { unique: true });      // one booking per slot
appointmentSchema.index({ status: 1, startsAt: 1 });              // admin lists
appointmentSchema.index({ creator: 1, startsAt: 1 });             // owner lists (fix: was clientId)
appointmentSchema.index({ "reminders.send24hAt": 1 });            // 24h scheduler
appointmentSchema.index({ "reminders.send1hAt": 1 });             // 1h scheduler
appointmentSchema.index({ role: 1 });                             // optional: filter by creator role

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
