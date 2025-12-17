import { useCallback, useEffect, useState } from "react";
import request from "../utils/request.js";
import useAuth from "../hooks/useAuth.js";

const baseUrl = 'http://localhost:3000/availability'

export const getSlots = async (date, durationMin) => {
    const params = new URLSearchParams();
    params.set("date", date);

    if (durationMin) params.set("durationMin", durationMin);

    return request.get(`${baseUrl}/slots?${params.toString()}`);
};

export const useGetSlots = (date, durationMin) => {
    const [freeSlots, setFreeSlots] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!date) return

        setIsLoading(true)

        const params = new URLSearchParams()
    
        params.set('date', date)
    
        if (durationMin) {
            params.set('durationMin', durationMin)
        }

        request.get(`${baseUrl}/slots?${params.toString()}`)
          .then(setFreeSlots)
          .finally(() => setIsLoading(false))
    }, [date, durationMin])

    return { freeSlots, isLoading }
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

    useEffect(() => {
        if (!month) return

        setIsLoading(true)

        const params = new URLSearchParams()
        params.set('month', month)

        if (durationMin) {
            params.set('durationMin', durationMin)
        }

        request.get(`${baseUrl}/calendar?${params.toString()}`)
          .then(setCalendar)
          .finally(() => setIsLoading(false))
    }, [month, durationMin])

    return { calendar, isLoading }
}