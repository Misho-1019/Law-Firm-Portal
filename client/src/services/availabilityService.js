import request from "../utils/request.js";

const baseUrl = 'http://localhost:3000/availability'

export const availabilityService = {
    async getCalendar(month, durationMin) {
        const params = new URLSearchParams()

        params.set('month', month)

        if (durationMin) {
            params.set('durationMin', durationMin)
        }

        return request.get(`${baseUrl}/calendar?${params.toString()}`)
    },

    async getSlots(date, durationMin) {
        const params = new URLSearchParams()

        params.set('date', date)

        if (durationMin) {
            params.set('durationMin', durationMin)
        }

        return request.get(`${baseUrl}/slots?${params.toString()}`)
    },

    getNextSlots(days = 7, durationMin = 120) {
        return request.get(`${baseUrl}/next?days=${days}&duration=${durationMin}`)
    }
}