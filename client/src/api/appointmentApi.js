import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";

const baseUrl = 'http://localhost:3000/appointments';

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

export const useMyAppointments = () => {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        request.get(`${baseUrl}/mine`)
          .then(setAppointments)
    }, [])

    return {
        myAppointments: appointments
    }
}

export const useAppointment = (appointmentId) => {
    const [appointment, setAppointment] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        request.get(`${baseUrl}/${appointmentId}`)
          .then(data => 
            setAppointment(data),
            setIsLoading(false)
          )
          .catch(err => 
            setError(err),
            setIsLoading(false)
          )
    }, [appointmentId])

    return {
        appointment,
        isLoading,
        error
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