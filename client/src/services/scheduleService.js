import request from "../utils/request";

const baseUrl = 'http://localhost:3000/admin';

export default {
    getSchedule() {
        return request.get(`${baseUrl}/schedule`)
    },
    getCalendarWeek(from, to) {
        return request.get(`${baseUrl}/calendar/week?from=${from}&to=${to}`)
    }
}