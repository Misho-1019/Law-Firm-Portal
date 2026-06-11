import { Schema, model, Document } from "mongoose";

export interface ITimeOff extends Document {
  dateFrom: string;
  dateTo: string;
  from?: string;
  to?: string;
  reason?: string;
}

const timeOffSchema = new Schema<ITimeOff>({
  dateFrom: { type: String, required: true },
  dateTo: { type: String, required: true },
  from: { type: String },
  to: { type: String },
  reason: { type: String, trim: true },
}, { timestamps: true });

timeOffSchema.index({ dateFrom: 1, dateTo: 1 });

const TimeOff = model<ITimeOff>("TimeOff", timeOffSchema);
export default TimeOff;
