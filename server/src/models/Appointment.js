import { Schema, model, Types } from "mongoose";

const appointmentSchema = new Schema(
  {
    creator: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
    startsAt: {
      type: Date,
      required: true,
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
      send24hAt: { type: Date },
      sent24hAt: { type: Date, default: null },
      send1hAt: { type: Date },
      sent1hAt: { type: Date, default: null },
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

appointmentSchema.pre('save', function () {
    if(this.isModified('startsAt')) {
        const start = this.startsAt instanceof Date ? this.startsAt : new Date(this.startsAt)

        const time = start.getTime();
        if (this.reminders) {
            this.reminders = {}
        }
        this.reminders.send24hAt = new Date(time - 24 * 60 * 60 * 1000)
        this.reminders.send1hAt = new Date(time - 60 * 60 * 1000)
        this.reminders.sent24hAt = null
        this.reminders.sent1hAt = null
    }
})

appointmentSchema.index({ startsAt: 1 }, { unique: false });
appointmentSchema.index({ status: 1, startsAt: 1 })
appointmentSchema.index({ clientId: 1, startsAt: 1 })
appointmentSchema.index({ 'reminders.send24hAt': 1 })
appointmentSchema.index({ 'reminders.send1hAt': 1 })

const Appointment = model("Appointment", appointmentSchema);

export default Appointment;
