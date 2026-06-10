import { useCallback, useEffect, useState } from "react";
import request from "../utils/request.js";
import useAuth from "../hooks/useAuth.js";
import { api } from "../config/api.js";

const baseUrl = api.availability;

export const getSlots = async (date, durationMin) => {
    const params = new URLSearchParams();
    params.set("date", date);

    if (durationMin) params.set("durationMin", durationMin);

    return request.get(`${baseUrl}/slots?${params.toString()}`);
};

export const useGetSlots = (date, durationMin) => {
    const [freeSlots, setFreeSlots] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!date) return

        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
    
        params.set('date', date)
    
        if (durationMin) {
            params.set('durationMin', durationMin)
        }

        request.get(`${baseUrl}/slots?${params.toString()}`)
          .then(setFreeSlots)
          .catch(setError)
          .finally(() => setIsLoading(false))
    }, [date, durationMin])

    return { freeSlots, isLoading, error }
}

export const useGetNextSlots = () => {
    const { request } = useAuth()

    const getNextSlots = useCallback(
        (days, durationMin) => 
            request.get(`${baseUrl}/next?days=${days}&duration=${durationMin}`),
        [request]
    )

    return {
        getNextSlots
    }
}

export const useGetCalendar = (month, durationMin) => {
    const [calendar, setCalendar] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!month) return

        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.set('month', month)

        if (durationMin) {
            params.set('durationMin', durationMin)
        }

        request.get(`${baseUrl}/calendar?${params.toString()}`)
          .then(setCalendar)
          .catch(setError)
          .finally(() => setIsLoading(false))
    }, [month, durationMin])

    return { calendar, isLoading, error }
}