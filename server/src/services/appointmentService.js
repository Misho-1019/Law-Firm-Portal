import Appointment from "../models/Appointment.js";

const day_ms = 24 * 60 * 60 * 1000;

export default {
    getAll() {
        return Appointment.find({});
    },
    async listMine(userId, { status, from, to, limit = 20, skip = 0, sort = 'asc'} = {}) {
        const query = { creator: userId }

        if (status) query.status = status;

        if (from || to) {
            query.startsAt = {}

            if (from) query.startsAt.$gte = new Date(from)
            if (to) query.startsAt.$lte = new Date(to)
        }

        const sortObj = { startsAt: sort === 'desc' ? -1 : 1 }
        const lim = Math.max(0, Number(limit) || 20)
        const skp = Math.max(0, Number(skip) || 0)

        const [ appointments, total ] = await Promise.all([
            await Appointment.find(query).sort(sortObj).skip(skp).limit(lim).lean(),
            Appointment.countDocuments(query),
        ])

        return { appointments, total, limit: lim, skip: skp }
    },
    getOne(appointmentId) {
        return Appointment.findById(appointmentId);
    },
    create(appointmentData, creatorId) {
        try {
            const result = Appointment.create({
                ...appointmentData,
                creator: creatorId,
            })
    
            return result
        } catch (error) {
            if (error && error.code === 11000) {
                const err = new Error('Time slot is no longer available!');
                err.status = 409;
                throw err;
            }
            throw error;
        }
    },
    async update(appointmentData, appointmentId) {
        const update = {};
    
        if (typeof appointmentData.notes === "string") {
          update.notes = appointmentData.notes.trim();
        }
    
        if (Object.prototype.hasOwnProperty.call(appointmentData, "status")) {
          update.status = appointmentData.status; // controller must block non-admin
        }
    
        if (Object.prototype.hasOwnProperty.call(appointmentData, "startsAt")) {
          const d = new Date(appointmentData.startsAt);
          if (Number.isNaN(d.getTime())) {
            const err = new Error("startsAt must be a valid date!");
            err.status = 400;
            throw err;
          }
          update.startsAt = d;
    
          // Recompute reminders + reset sent flags (findByIdAndUpdate won't trigger pre('save'))
          const t = d.getTime();
          update.reminders = {
            send24hAt: new Date(t - 24 * 60 * 60 * 1000),
            sent24hAt: null,
            send1hAt: new Date(t - 60 * 60 * 1000),
            sent1hAt: null,
          };
        }
    
        try {
          const doc = await Appointment.findByIdAndUpdate(appointmentId, update, {
            new: true,
            runValidators: true,
          });
          return doc;
        } catch (error) {
          if (error && error.code === 11000) {
            const err = new Error("Time slot is no longer available!");
            err.status = 409;
            throw err;
          }
          throw error;
        }
    },
    async updateStatus(appointmentId, user) {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            const err = new Error('Appointment not found!');
            err.status = 404;
            throw err;
        }

        const isOwner = appointment.creator?.toString() === user || appointment.creator === user;
        const isAdmin = user.role === 'Admin';

        if (!isOwner && !isAdmin) {
            const err = new Error('You are not authorized to update this appointment!');
            err.status = 403;
            throw err;
        }

        if (!isAdmin) {
            const msUntilAppointment = appointment.startsAt.getTime() - Date.now();

            if (msUntilAppointment < day_ms) {
                const err = new Error('Too late to cancel: less than 24 hours before the appointment.');
                err.status = 422;
                throw err;
            }
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: 'CANCELLED' },
            { new: true, runValidators: true }
        )

        return updatedAppointment;
    },
    async delete(appointmentId) {
        return await Appointment.findByIdAndDelete(appointmentId)
    }
}