import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronRight,
  ChevronLeft,
  MapPin,
  AlertCircle,
  CheckCircle2,
  MinusCircle,
  User,
  Info,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import { getDateAndTime, prettyDate } from "../../utils/dates";
import { useEffect, useState } from "react";
import { availabilityService } from "../../services/availabilityService";
import timeOffService from "../../services/timeOffService";
import { endTime } from "../../utils/time";
import useAuth from "../../hooks/useAuth";
import { useAppointments } from "../../api/appointmentApi";

const MotionSection = motion.section;

export default function DayDetailsPage() {
  const { date: dateParam } = useParams(); // expected "YYYY-MM-DD"
  const navigate = useNavigate();
  const { role } = useAuth()
  const { appointments } = useAppointments()

  const [freeSlots, setFreeSlots] = useState([])
  const [durationMin, setDurationMin] = useState('120')
  const [_slotsLoading, setSlotsLoading] = useState(false)

  const [timeOff, setTimeOff] = useState([])

  const titleDate = prettyDate(String(dateParam));

  // UI-only placeholders for now
  const isToday =
    dateParam &&
    new Date().toISOString().slice(0, 10) === dateParam;

  const allAppointments = appointments.appointments || [];

  useEffect(() => {
    if(!dateParam) return
    
    setSlotsLoading(true)

    availabilityService.getSlots(dateParam, Number(durationMin))
      .then(setFreeSlots)
      .finally(() => setSlotsLoading(false))
  }, [dateParam, durationMin])

  const allFreeSlots = freeSlots.slots || [];

  useEffect(() => {
    timeOffService.getAll()
      .then(setTimeOff)
  }, [])

  const goPrevDay = () => {
    if (!dateParam) return;
    const d = new Date(dateParam);
    d.setDate(d.getDate() - 1);
    const next = d.toISOString().slice(0, 10);
    navigate(`/day/${next}`);
  };

  const goNextDay = () => {
    if (!dateParam) return;
    const d = new Date(dateParam);
    d.setDate(d.getDate() + 1);
    const next = d.toISOString().slice(0, 10);
    navigate(`/day/${next}`);
  };

  const todayAppts = allAppointments.filter(x => {
    const d = new Date(x?.startsAt)
    const isoDay = d.toISOString().slice(0, 10)
    return isoDay === dateParam;
  })

  let hasTimeOff = timeOff.filter((x) => {
    if (!x?.dateFrom || !x?.dateTo) return false;
    
    return (
      x?.dateFrom === dateParam || 
      (dateParam >= x?.dateFrom && dateParam <= x?.dateTo)
    )
  })  
 
  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Breadcrumb / header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
                <CalendarIcon className="h-7 w-7 text-[#2F80ED]" />
                {titleDate}
              </h1>
              <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">
                Overview of appointments, working hours, time off and
                free slots for this day.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <button
                type="button"
                onClick={goPrevDay}
                className="inline-flex items-center gap-1 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev day
              </button>
              <button
                type="button"
                onClick={goNextDay}
                className="inline-flex items-center gap-1 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
              >
                Next day
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Summary cards */}
          <MotionSection
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-3"
          >
            <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Appointments
                </span>
                <Clock className="h-4 w-4 text-[#94A3B8]" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {todayAppts.length}
              </div>
              <p className="mt-1 text-xs text-[#334155] dark:text-[#94A3B8]">
                Total booked for this day
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Free start times
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Duration:
                  </span>
                  <select 
                    value={durationMin} 
                    onChange={(e) => setDurationMin(e.target.value)}
                    className="text-xs rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-2 py-1"
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="100">100 min</option>
                    <option value="120">120 min</option>
                    <option value="135">135 min</option>
                  </select>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {freeSlots.slots?.length}
              </div>
              <p className="mt-1 text-xs text-[#334155] dark:text-[#94A3B8]">
                Potential new appointment starts ({durationMin} min)
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Time off & blocks
                </span>
                <AlertCircle className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {hasTimeOff.length ? "Yes" : "No"}
              </div>
              <Link to={`/timeoff/${dateParam}`} className="mt-1 text-xs text-[#334155] dark:text-[#94A3B8] underline">
                Check if time off is for the whole day!
              </Link>
            </div>
          </MotionSection>

          {/* Main layout: left (schedule), right (context) */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: schedule + appointments */}
            <div className="space-y-6 lg:col-span-2">
              {/* Working hours & time off */}
              <MotionSection
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
              >
                <div className="p-4 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Working hours & time off
                    </h2>
                    <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                      Admin schedule plus time off blocks for this date.
                    </p>
                  </div>
                  <span className="rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1 text-[11px] text-[#334155] dark:text-[#94A3B8]">
                    UI only – data pending
                  </span>
                </div>
                <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />

                <div className="p-4 grid gap-3 md:grid-cols-2">
                  {/* Working intervals */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Working hours
                    </h3>
                    <ul className="space-y-1.5 text-sm text-[#334155] dark:text-[#94A3B8]">
                      {todayAppts.length === 0 ? (
                        <p className="text-xs text-[#9CA3AF]">
                          No appointments scheduled for this date yet or appointments which you don't have permission to see. Look at the 'Free start times' 
                          section to see available slots.
                        </p>
                      ) : (todayAppts.map((appointment) => {
                      const {_day, _date, time} = getDateAndTime(String(new Date(appointment.startsAt)));

                      const end = endTime(String(time), Number(appointment.durationMin))                    

                      if (role === 'Admin') {
                        return (
                          <Link
                            key={appointment._id}
                            to={`/appointments/${appointment._id}/details`}
                            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5"
                          >
                            <span>
                              {time} – {end}
                            </span>
                            <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                              Working
                            </span>
                          </Link>
                        )
                      } else {
                        return (
                          <li
                            key={appointment._id}
                            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5"
                          >
                            <span>
                              {time} – {end}
                            </span>
                            <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                              Working
                            </span>
                          </li>
                        )
                      }
                      
                      }))}
                    </ul>
                  </div>

                  {/* Time off blocks */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      Time off
                    </h3>
                    {hasTimeOff.length === 0 ? (
                      <p className="text-xs text-[#9CA3AF]">
                        No time off recorded for this date.
                      </p>
                    ) : (
                      <ul className="space-y-1.5 text-sm text-[#334155] dark:text-[#94A3B8]">
                        {hasTimeOff.map((t) => (
                          <li
                            key={t._id}
                            className="flex items-center justify-between rounded-xl border border-[#F87171]/60 dark:border-[#B91C1C]/80 bg-red-50/60 dark:bg-red-900/30 px-3 py-1.5"
                          >
                            <div>
                              <div className="font-medium text-red-700 dark:text-red-200 text-xs">
                                {t.from ? (
                                  <span>
                                    {t.from} – {t.to}
                                  </span>
                                ) : (
                                  <span>Whole day off</span>
                                )}
                              </div>
                              <div className="text-[11px] text-red-700/80 dark:text-red-200/80">
                                {t.reason}
                              </div>
                            </div>
                            <MinusCircle className="h-4 w-4 text-red-500 dark:text-red-300" />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </MotionSection>

              {/* Appointments list */}
              <MotionSection
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
              >
                <div className="p-4 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Appointments for this day
                    </h2>
                    <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                      Both admin and clients will see the same timeline, with
                      permissions handled later.
                    </p>
                  </div>
                </div>
                <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />

                <ul className="p-4 space-y-3 text-sm">
                  {todayAppts.map((appt) => {
                    const { _day, _date, time } = getDateAndTime(String(new Date(appt.startsAt)))

                    const end = endTime(time, Number(appt.durationMin))

                    return (
                      <li
                        key={appt._id}
                        className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-3 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#94A3B8]" />
                            <span className="font-medium">
                              {time} – {end}
                            </span>
                          </div>
                          <StatusPill status={appt.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs rounded-full bg-[#2F80ED]/10 text-[#2F80ED] px-2 py-0.5">
                            {appt.service}
                          </span>
                          <span className="text-xs rounded-full bg-[#111827]/5 dark:bg-[#F9FAFB]/5 px-2 py-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appt.mode}
                          </span>
                          <span className="text-xs rounded-full bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {appt.firstName} {appt.lastName}
                          </span>
                        </div>
                      </li>
                    )
                  })}

                  {todayAppts.length === 0 && (
                    <li className="rounded-2xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] px-3 py-6 text-center text-xs text-[#9CA3AF]">
                      No appointments scheduled for this date yet.
                    </li>
                  )}
                </ul>
              </MotionSection>
            </div>

            {/* Right: free slots + meta */}
            <div className="space-y-6">
              {/* Free slot starts */}
              <MotionSection
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
              >
                <div className="p-4 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Free start times
                    </h2>
                    <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                      Generated from working hours, time off and existing
                      appointments.
                    </p>
                  </div>
                </div>
                <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />

                <div className="p-4 flex flex-wrap gap-2">
                  {allFreeSlots.length === 0 ? (
                    <p className="text-xs text-[#9CA3AF]">
                      No free start times for this day.
                    </p>
                  ) : (
                    allFreeSlots.map((t, i) => {
                      const { _day, _date, time } = getDateAndTime(String(new Date(t)))
                      
                      return (
                      <Link
                        key={i}
                        to={`/create`}
                        className="text-xs rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#2F80ED] hover:text-white transition-colors"
                      >
                        {time}
                      </Link>
                    )})
                  )}
                </div>
              </MotionSection>

              {/* Info block */}
              <MotionSection
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
              >
                <div className="p-4 flex items-start gap-3 text-sm">
                  <div className="mt-1">
                    <Info className="h-4 w-4 text-[#2F80ED]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">How this page will work</h3>
                    <p className="text-[#334155] dark:text-[#94A3B8] text-xs">
                      • Admin: see working schedule, time off and all
                      appointments for this day, plus free slots for new
                      bookings.
                    </p>
                    <p className="text-[#334155] dark:text-[#94A3B8] text-xs">
                      • Clients: see only their appointments and available
                      start times for new bookings (other clients anonymized).
                    </p>
                    {isToday && (
                      <p className="text-[#16A34A] text-xs font-medium">
                        This is today – live state will be especially
                        important once functionality is wired in.
                      </p>
                    )}
                  </div>
                </div>
              </MotionSection>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © {new Date().getFullYear()} LexSchedule. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

/* ----------------------- helpers ------------------------- */

function StatusPill({ status }) {
  const s = status || "PENDING";
  if (s === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[11px] font-semibold">
        <CheckCircle2 className="h-3 w-3" />
        Confirmed
      </span>
    );
  }
  if (s === "CANCELLED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-500 px-2 py-0.5 text-[11px] font-semibold">
        <MinusCircle className="h-3 w-3" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-500 px-2 py-0.5 text-[11px] font-semibold">
      <AlertCircle className="h-3 w-3" />
      Pending
    </span>
  );
}
