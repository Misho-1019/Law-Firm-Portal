import Appointment from "../models/Appointment.js";

export default {
    getAll() {
        return Appointment.find({});
    },
    getOne(appointmentId) {
        return Appointment.findById(appointmentId);
    },
    create(appointmentData, creatorId) {
        const result = Appointment.create({
            ...appointmentData,
            creator: creatorId,
        })

        return result
    },
    async update(appointmentData, appointmentId) {
        const update = {};

        if (typeof appointmentData.notes === 'string') {
            update.notes = appointmentData.notes.trim();
        }

        if (Object.prototype.hasOwnProperty.call(appointmentData, 'status')) {
            update.status = appointmentData.status;
        }

        if (Object.prototype.hasOwnProperty.call(appointmentData, 'startsAt')) {
            const d = new Date(appointmentData.startsAt);

            if (Number.isNaN(d.getTime())) {
                const err = new Error('startsAt must be a valid date!');
                err.status = 400;
                throw err;
            }

            update.startsAt = d;

            const t = d.getTime();

            update.reminders = {
                send24hAt: new Date(t - 24 * 60 * 60 * 1000),
                sent24hAt: null,
                send1hAt: new Date(t - 60 * 60 * 1000),
                sent1hAt: null,
            }
        }

        try {
            const doc = await Appointment.findByIdAndUpdate(appointmentId, update, { new: true, runValidators: true })

            return doc;
        } catch (error) {
            if (error && error.code === 11000) {
                const err = new Error('Time slot is no longer available!');
                err.status = 409;
                throw err;
            }
            throw error;
        }
    },
    async delete(appointmentId) {
        return await Appointment.findByIdAndDelete(appointmentId)
    }
}