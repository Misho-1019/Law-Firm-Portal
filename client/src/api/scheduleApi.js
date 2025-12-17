import { useEffect, useState } from "react";
import request from "../utils/request";

const baseUrl = "http://localhost:3000/admin";

export const useSchedule = () => {
    const [scheduleData, setScheduleData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        request.get(`${baseUrl}/schedule`)
          .then((data) => setScheduleData(data))
          .finally(() => setIsLoading(false));
    }, [])

    return { scheduleData, isLoading };
}

export const useCalendarWeek = (from, to) => {
  const [weekData, setWeekData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!from || !to) return;

    setIsLoading(true);
    setError(null);

    request
      .get(`${baseUrl}/calendar/week?from=${from}&to=${to}`)
      .then((data) => setWeekData(data))
      .catch((err) => {
        console.error('Error fetching calendar week data:', err);
        setError(err)
        setWeekData(null)
      })
      .finally(() => setIsLoading(false));
  }, [from, to]);

  return { weekData, isLoading, error };
};
