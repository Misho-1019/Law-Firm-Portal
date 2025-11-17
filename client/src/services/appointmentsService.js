const baseUrl = 'http://localhost:3000/appointments';

export default {
    async create(appointmentData) {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        })

        const result = await response.json()

        return result;
    }
}