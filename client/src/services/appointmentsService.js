import request from "../utils/request";

const baseUrl = 'http://localhost:3000/appointments';

export default {
    async getAll() {
        const result = await request.get(baseUrl);

        const appointments = Object.values(result)

        return appointments;
    },
    create(appointmentData, creatorId) {
        return request.post(`${baseUrl}/create`, appointmentData, creatorId)
    },
    getOne(appointmentId) {
        return request.get(`${baseUrl}/${appointmentId}`)
    },
    delete(appointmentId) {
        return request.delete(`${baseUrl}/${appointmentId}`)
    }
}