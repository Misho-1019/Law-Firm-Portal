import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";
import { api } from "../config/api";

const baseUrl = api.appointments;

export const useCreateAppointment = () => {
    const { request } = useAuth()

    const create = (appointmentData) =>
        request.post(`${baseUrl}/create`, appointmentData)

    return {
        create,
    }
}

export const useAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(baseUrl)
          .then(setAppointments)
          .catch(setError)
          .finally(() => setIsLoading(false))
    }, [])

    return { appointments, isLoading, error }
}

export const useMyAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/mine`)
          .then(setAppointments)
          .catch(setError)
          .finally(() => setIsLoading(false))
    }, [])

    return {
        myAppointments: appointments,
        isLoading,
        error
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
          .then(data => {
            setAppointment(data);
            setIsLoading(false);
          })
          .catch(err => {
            setError(err);
            setIsLoading(false);
          })
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
        request.patch(`${baseUrl}/${appointmentId}`, appointmentData)

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