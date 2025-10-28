import { Schema, model } from "mongoose";

const timeOffSchema = new Schema({
    dateFrom: {
        type: String,
        required: true,
    },
    dateTo: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
    },
}, {timestamps: true });

timeOffSchema.index({ dateFrom: 1, dateTo: 1 })

const TimeOff = model('TimeOff', timeOffSchema)

export default TimeOff;