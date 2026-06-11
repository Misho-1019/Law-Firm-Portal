import { Schema, model, Document } from "mongoose";

export interface ISettings extends Document {
  firmName: string;
}

const settingsSchema = new Schema<ISettings>({
  firmName: { type: String, default: "LexSchedule", trim: true },
}, { timestamps: true, versionKey: false });

const Settings = model<ISettings>("Settings", settingsSchema);
export default Settings;
