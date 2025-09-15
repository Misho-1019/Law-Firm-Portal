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
        return await Appointment.findByIdAndUpdate(appointmentId, appointmentData)
    },
    async delete(appointmentId) {
        return await Appointment.findByIdAndDelete(appointmentId)
    }
}