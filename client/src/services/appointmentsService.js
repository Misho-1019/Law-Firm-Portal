import request from "../utils/request";

const baseUrl = 'http://localhost:3000/appointments';

export default {
    async getAll() {
        const result = await request.get(baseUrl);

        const appointments = Object.values(result)

        return appointments;
    },
    create(appointmentData) {
        return request.post(baseUrl, appointmentData)
    },
    getOne(appointmentId) {
        return request.get(`${baseUrl}/${appointmentId}`)
    },
    delete(appointmentId) {
        return request.delete(`${baseUrl}/${appointmentId}`)
    }
}