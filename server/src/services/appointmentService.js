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
    }
}