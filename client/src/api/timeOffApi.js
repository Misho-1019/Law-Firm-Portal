import { useEffect, useState } from "react";
import request from "../utils/request";
import useAuth from "../hooks/useAuth";

const baseUrl = 'http://localhost:3000/admin'

export function buildTimeOffPayload({ mode, startDate, endDate, selectedSlots, reason }) {
    const isSingleDay = startDate === endDate;

    if (mode === 'Full Day' || !isSingleDay) {
        return {
            dateFrom: startDate,
            dateTo: endDate,
            reason,
        }
    }

    if (!selectedSlots || selectedSlots.length === 0) {
        return {
            dateFrom: startDate,
            dateTo: endDate,
            reason,
        }
    }

    const sorted = [...selectedSlots].sort();
    const from = sorted[0];
    const last = sorted[sorted.length - 1]

    const [h, m] = last.split(':').map(Number)
    const endMinutes = h * 60 + m + 30;

    const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0')
    const endM = String(endMinutes % 60).padStart(2, '0')
    
    const to = `${endH}:${endM}`

    return {
        dateFrom: startDate,
        dateTo: endDate,
        from,
        to,
        reason,
    }
}

export default {
    async getAll() {
        const result = await request.get(`${baseUrl}/timeOff`)
        
        return result.items || [];
    },
    create(timeoffData) {
        return request.post(`${baseUrl}/timeOff`, timeoffData)
    },
    update(timeoffData, timeOffId) {
        return request.put(`${baseUrl}/timeOff/${timeOffId}`, timeoffData)
    },
    delete(timeOffId) {
        return request.delete(`${baseUrl}/timeOff/${timeOffId}`)
    }
}

export const useTimeOffs = () => {
    const [timeOffs, setTimeOffs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        request.get(`${baseUrl}/timeOff`)
          .then(data => setTimeOffs(data.items || []))
          .finally(() => setIsLoading(false))
    }, [])

    return {
        timeOffs,
        setTimeOffs,
        isLoading,
    }
}

export const useCreateTimeOff = () => {
    const { request } = useAuth()

    const create = (timeoffData) =>
        request.post(`${baseUrl}/timeOff`, timeoffData)

    return {
        create,
    }
}