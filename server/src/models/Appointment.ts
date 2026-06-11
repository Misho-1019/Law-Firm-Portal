import { Schema, model, Document, Types } from "mongoose";
import { toSofiaISO } from "../lib/time.js";

export interface IAppointment extends Document {
  creator: Types.ObjectId;
  lawyerId?: Types.ObjectId;
  firstName: string;
  lastName: string;
  role: "Admin" | "Client";
  service: string;
  mode: "In-Person" | "Online";
  startsAt: Date;
  durationMin: number;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED";
  notes?: string;
  reminders: {
    send24hAt: Date;
    sent24hAt: Date | null;
    send1hAt: Date;
    sent1hAt: Date | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  lawyerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Client"], default: "Client" },
  service: { type: String, required: true, trim: true, minLength: 1 },
  mode: { type: String, required: true, enum: ["In-Person", "Online"] },
  startsAt: { type: Date, required: true, index: true },
  durationMin: { type: Number, min: 15, max: 480, required: true, default: 120 },
  status: { type: String, enum: ["PENDING", "CONFIRMED", "DECLINED", "CANCELLED"], default: "PENDING", index: true },
  notes: { type: String, trim: true },
  reminders: {
    send24hAt: { type: Date, index: true },
    sent24hAt: { type: Date, default: null },
    send1hAt: { type: Date, index: true },
    sent1hAt: { type: Date, default: null },
  },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      ret.startsAt = toSofiaISO(ret.startsAt);
      ret.createdAt = toSofiaISO(ret.createdAt);
      ret.updatedAt = toSofiaISO(ret.updatedAt);
      if (ret.reminders) {
        ret.reminders.send24hAt = toSofiaISO(ret.reminders.send24hAt);
        ret.reminders.sent24hAt = toSofiaISO(ret.reminders.sent24hAt);
        ret.reminders.send1hAt = toSofiaISO(ret.reminders.send1hAt);
        ret.reminders.sent1hAt = toSofiaISO(ret.reminders.sent1hAt);
      }
      return ret;
    },
  },
});

appointmentSchema.index({ startsAt: 1 }, { unique: true });
appointmentSchema.index({ status: 1, startsAt: 1 });
appointmentSchema.index({ creator: 1, startsAt: 1 });
appointmentSchema.index({ "reminders.send24hAt": 1 });
appointmentSchema.index({ "reminders.send1hAt": 1 });
appointmentSchema.index({ role: 1 });

const Appointment = model<IAppointment>("Appointment", appointmentSchema);
export default Appointment;
