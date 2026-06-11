import { Schema, model } from "mongoose";

const settingsSchema = new Schema({
  firmName: {
    type: String,
    default: "LexSchedule",
    trim: true,
  },
}, { timestamps: true, versionKey: false });

export default model("Settings", settingsSchema);
