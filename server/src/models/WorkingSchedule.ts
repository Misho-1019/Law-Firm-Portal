import { Schema, model, Document, Types } from "mongoose";

export interface IDayInterval {
  from: string;
  to: string;
}

export interface IScheduleDay {
  weekday: number;
  intervals: IDayInterval[];
}

export interface IWorkingSchedule extends Document {
  lawyerId: Types.ObjectId;
  tz: string;
  days: IScheduleDay[];
}

const daySchema = new Schema<IScheduleDay>({
  weekday: { type: Number, min: 0, max: 6, required: true },
  intervals: [{ from: String, to: String }],
}, { _id: false });

const scheduleSchema = new Schema<IWorkingSchedule>({
  lawyerId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  tz: { type: String, default: "Europe/Sofia" },
  days: [daySchema],
}, { timestamps: true });

const WorkingSchedule = model<IWorkingSchedule>("WorkingSchedule", scheduleSchema);
export default WorkingSchedule;
