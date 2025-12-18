/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  MapPin,
  MonitorSmartphone,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toUTCISO } from "../../utils/time";
import useAuth from "../../hooks/useAuth";
import { getDateAndTime } from "../../utils/dates";
import { useCreateAppointment } from "../../api/appointmentApi";
import { getSlots } from "../../api/availabilityApi";
import { showToast } from "../../utils/toastUtils";

const MotionSection = motion.section;

function normalizeDuration(raw) {
  let d = Number(raw)

  if (!Number.isFinite(d)) d = 120;

  d = Math.max(15, Math.min(480, d))

  return d;
}

export default function CreateAppointmentPage() {
  const { id, role } = useAuth()
  const navigate = useNavigate();
  const { create } = useCreateAppointment()
  const [searchParams] = useSearchParams()

  const [selectedTime, setSelectedTime] = useState("");
  const [mode, setMode] = useState("In-Person");
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState('120')
  const [availableTimes, setAvailableTimes] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const loadSlotsForDate = async (nextDate, currentDuration) => {
    if (!nextDate) {
      setAvailableTimes([])

      return;
    }

    const effDuration = normalizeDuration(currentDuration);
    
    setSlotsLoading(true)
    setAvailableTimes([])
    setSelectedTime('')

    try {
      const res = await getSlots(nextDate, effDuration);
      const slots = res.slots || [];

      const times = slots.map((iso) => {
        const d = new Date(iso);

        const { day, date, time } = getDateAndTime(String(d))

        return time;
      })

      setAvailableTimes(times)
    } catch (err) {
      console.error('Failed to load slots:', err);
      setAvailableTimes([]);
    } finally {
      setSlotsLoading(false)
    }
  }

  useEffect(() => {
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    const durationParam = searchParams.get('duration')

    
    if (dateParam) {
      const validDate = new Date(dateParam).toISOString().slice(0, 10);
      setDate(validDate)
      setDuration(durationParam)
      loadSlotsForDate(validDate, durationParam)
    }

    if (timeParam) {
      setSelectedTime(timeParam)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formAction = async (formData) => {
    try {
      const date = formData.get("date");
      const time = formData.get("time");

      if (!date || !time) {
        showToast('Please select a date and time.', 'warning')
        return;
      }
  
      const rawDuration = formData.get("durationMin")
      let durationMin = normalizeDuration(rawDuration)
  
      const startsAt = toUTCISO(date, time, "Europe/Sofia");
  
      const appointmentData = {
        ...Object.fromEntries(formData),
        startsAt,
        durationMin,
      };
  
      delete appointmentData.date;
      delete appointmentData.time;
  
      await create(appointmentData, id)

      showToast('Appointment created successfully!', 'success')
      
      if (role === 'Admin') {
        navigate('/appointments')
      } else {
        navigate('/client')
      }
    } catch (error) {
      showToast('Failed to create appointment. Please try again.', 'error')
      console.error('Error creating appointment:', error);
    }
  };

  const handleDateChange = async (value) => {
    setDate(value)

    await loadSlotsForDate(value, duration)
  }

  const handleDurationChange = async (e) => {
    const value = e.target.value;

    setDuration(value)

    if (date) {
      await loadSlotsForDate(date, value)
    }
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Main card */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-5xl rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-visible"
          >
            <div className="grid lg:grid-cols-5">
              {/* Form side */}
              <div className="lg:col-span-3 p-6 md:p-8">
                <h1 className="text-2xl font-semibold">
                  Create an appointment
                </h1>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">
                  Choose a time that works for you. Times are shown in{" "}
                  <span className="font-medium">Europe/Sofia</span>.
                </p>

                {/* ✅ Properly closed <form> */}
                <form className="mt-6 space-y-5" action={formAction} noValidate>
                  {/* First / Last name */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="First name"
                      id="firstName"
                      name="firstName"
                      placeholder="Mila"
                      icon={<FileText className="h-4 w-4" />}
                    />
                    <Field
                      label="Last name"
                      id="lastName"
                      name="lastName"
                      placeholder="Georgieva"
                      icon={<FileText className="h-4 w-4" />}
                    />
                  </div>

                  {/* Service */}
                  <Field
                    label="Service"
                    id="service"
                    name="service"
                    placeholder="Initial consultation, Contract review, ..."
                    icon={<FileText className="h-4 w-4" />}
                  />

                  {/* Mode (visual only) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice
                        name="mode"
                        value="In-Person"
                        defaultChecked={mode === "In-Person"}
                        icon={<MapPin className="h-4 w-4" />}
                        title="In-Person"
                        subtitle="At the office"
                      />
                      <Choice
                        name="mode"
                        value="Online"
                        defaultChecked={mode === "Online"}
                        icon={<MonitorSmartphone className="h-4 w-4" />}
                        title="Online"
                        subtitle="Video Call"
                      />
                    </div>
                  </div>

                  <Field
                    label="Date"
                    id="date"
                    name="date"
                    type="date"
                    icon={<CalendarIcon className="h-4 w-4" />}
                    hint="Format: YYYY-MM-DD"
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />

                  {/* Time grid (09:00–17:00) */}
                  <div className="space-y-1.5">
                    <label
                      className="text-sm font-medium flex items-center gap-2"
                      htmlFor="time"
                    >
                      <Clock className="h-4 w-4" /> Time (09:00–17:00)
                    </label>
                    <TimeGrid
                      id="time"
                      name="time"
                      value={selectedTime}
                      onChange={setSelectedTime}
                      slots={date ? availableTimes : [] }
                    />
                    {/* keep a hidden input so forms still have a value if you later wire this up */}
                    <input
                      type="hidden"
                      name="time"
                      value={selectedTime || ""}
                    />

                    {slotsLoading && (
                      <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                        Loading availability…
                      </p>
                    )}

                    {!slotsLoading && date && availableTimes.length === 0 && (
                      <p className="text-xs text-[#DC2626]">
                        No available slots for this date. Please pick another
                        day or change the duration.
                      </p>
                    )}

                    {!date && (
                      <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                        Select a date to see available times.
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <Field
                    label="Duration (minutes)"
                    id="durationMin"
                    name="durationMin"
                    type="number"
                    icon={<Clock className="h-4 w-4" />}
                    min={15}
                    max={480}
                    step={15}
                    placeholder="120"
                    hint="Allowed range: 15–480. Default is 120."
                    value={duration}
                    onChange={handleDurationChange}
                  />

                  {/* Notes */}
                  <Field
                    label="Notes (optional)"
                    id="notes"
                    name="notes"
                    placeholder="Anything we should know before the meeting?"
                    icon={<FileText className="h-4 w-4" />}
                  />

                  {/* CTA (disabled) */}
                  <button
                    type="submit"
                    className="relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white"
                    aria-label="Create appointment"
                    disabled={!date || !selectedTime}
                  >
                    Create appointment
                  </button>
                </form>
                {/* ← closes form correctly */}
              </div>

              {/* Side panel */}
              <aside className="lg:col-span-2 hidden lg:block bg-[#0E1726] text-white">
                <div className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold relative pb-2">
                      Booking tips
                    </h2>
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
                    <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                      <li>Times are in Europe/Sofia (EET/EEST).</li>
                      <li>Use the calendar to avoid taken slots.</li>
                      <li>Duration can be 15–480 minutes.</li>
                      <li>Online or In-Person — your choice.</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-xs text-white/70">
                    <p>
                      We’ll send reminders (24h/1h) based on your chosen time.
                    </p>
                    <p>Cancelling may be restricted in the last 24h.</p>
                  </div>
                </div>
              </aside>
            </div>
          </MotionSection>
        </main>

        <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © LexSchedule. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Presentational Fields & Choices (pure UI)
---------------------------------------------------------- */
function Field({
  id,
  name,
  label,
  icon,
  type = "text",
  placeholder = "",
  hint,
  ...rest
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2">
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="text-[#334155] dark:text-[#94A3B8]">{icon}</span>
          ) : null}
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
            {...rest}
          />
        </div>
      </div>
      {hint ? (
        <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p>
      ) : null}
    </div>
  );
}

function Choice({
  name,
  value,
  defaultChecked = false,
  icon,
  title,
  subtitle,
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border px-3 py-3 cursor-pointer border-[#E5E7EB] dark:border-[#1F2937] has-[:checked]:border-[#2F80ED] has-[:checked]:bg-[rgb(47,128,237,0.08)]">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-1"
      />
      <span className="mt-0.5 text-[#334155] dark:text-[#94A3B8]">{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs opacity-80">{subtitle}</span>
      </span>
    </label>
  );
}

/* Time grid picker — UI-only */
function TimeGrid({
  value,
  onChange,
  start = "09:00",
  end = "17:00",
  stepMinutes = 30,
  slots,
}) {
  let finalSlots;

  if (slots !== undefined) {
    finalSlots = slots;
  } else {
    const generated = [];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    for (let m = startMin; m <= endMin; m += stepMinutes) {
      const h = String(Math.floor(m / 60)).padStart(2, "0");
      const mi = String(m % 60).padStart(2, "0");
      generated.push(`${h}:${mi}`);
    }

    finalSlots = generated;
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {finalSlots.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange && onChange(t)}
          className={[
            "px-3 py-2 rounded-xl border text-sm transition",
            value === t
              ? "border-[#2F80ED] bg-[#2F80ED] text-white shadow"
              : "border-[#E5E7EB] dark:border-[#1F2937] text-[#0B1220] dark:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]",
          ].join(" ")}
          aria-pressed={value === t}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
