import Appointment from "../models/Appointment.js";

export default {
    getAll() {
        return Appointment.find({});
    }
}