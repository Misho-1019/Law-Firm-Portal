import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";

const baseUrl = 'http://localhost:3000/appointments';

export default {
    async getAll() {
        const result = await request.get(baseUrl);

        const appointments = Object.values(result)

        return appointments;
    },
    async getMine() {
        const result = await request.get(`${baseUrl}/mine`)

        const appointments = Object.values(result)

        return appointments;
    },
    create(appointmentData, creatorId) {
        return request.post(`${baseUrl}/create`, appointmentData, creatorId)
    },
    getOne(appointmentId) {
        return request.get(`${baseUrl}/${appointmentId}`)
    },
    patch(appointmentData, appointmentId) {
        return request.patch(`${baseUrl}/${appointmentId}`, {...appointmentData, _id: appointmentId})
    },
    delete(appointmentId) {
        return request.delete(`${baseUrl}/${appointmentId}`)
    }
}

export const useCreateAppointment = () => {
    const { request } = useAuth()

    const create = (appointmentData, creatorId) =>
        request.post(`${baseUrl}/create`, appointmentData, creatorId)

    return {
        create,
    }
}

export const useAppointments = () => {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        request.get(baseUrl)
          .then(setAppointments)
    }, [])

    return { appointments }
}

export const useAppointment = (appointmentId) => {
    const [appointment, setAppointment] = useState({})

    useEffect(() => {
        request.get(`${baseUrl}/${appointmentId}`)
          .then(setAppointment)
    }, [appointmentId])

    return {
        appointment,
    }
}

export const usePatchAppointment = () => {
    const { request } = useAuth();

    const patch = (appointmentData, appointmentId) =>
        request.patch(`${baseUrl}/${appointmentId}`, { ...appointmentData, _id: appointmentId })

    return {
        patch,
    }
}

export const useDeleteAppointment = () => {
    const { request } = useAuth();

    const deleteAppointment = (appointmentId) =>
        request.delete(`${baseUrl}/${appointmentId}`)

    return {
        deleteAppointment,
    }
}