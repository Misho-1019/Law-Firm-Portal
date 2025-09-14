import Appointment from "../models/Appointment.js";

export default {
    getAll() {
        return Appointment.find({});
    },
    getOne(appointmentId) {
        return Appointment.findById(appointmentId);
    }
}