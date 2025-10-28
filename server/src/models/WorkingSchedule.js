import { Schema, model } from "mongoose";

const daySchema = new Schema({
    weekday: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    },
    intervals: [{
        from: String,
        to: String,
    }]
}, { _id: false })

const scheduleSchema = new Schema({
    tzone: {
        type: String,
        default: 'Europe/Sofia',
    },
    days: [daySchema],
}, {timestamps: true });

const WorkingSchedule = model('WorkingSchedule', scheduleSchema)

export default WorkingSchedule;