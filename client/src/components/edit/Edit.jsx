/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  MapPin,
  MonitorSmartphone,
  ChevronRight,
  Save,
  Loader2
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import appointmentsService from "../../services/appointmentsService";
import { getDateAndTimeDefaults } from "../../utils/dates";
import { toUTCISO } from "../../utils/time";
import useAuth from "../../hooks/useAuth";
import { useAppointment } from "../../api/appointmentApi";

const MotionSection = motion.section;

export default function EditAppointmentPage() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { appointment } = useAppointment(appointmentId)

  const [selectedTime, setSelectedTime] = useState("");

  const dateAndTime = getDateAndTimeDefaults(String(appointment?.startsAt));
  
  useEffect(() => {
    if (appointment.startsAt) {
      const { date, time } = getDateAndTimeDefaults(String(appointment?.startsAt));
      setSelectedTime(time);
    }
  }, [appointment?.startsAt])

  const formAction = async (formData) => {
    const date = formData.get('date')
    const time = formData.get('time')
    const rawDuration = formData.get('durationMin')

    const startsAt = toUTCISO(date, time, 'Europe/Sofia')

    let durationMin = Number(rawDuration)

    if (!Number.isFinite(durationMin)) durationMin = 120;

    durationMin = Math.max(15, Math.min(480, durationMin))

    const appointmentData = {
      ...Object.fromEntries(formData),
      startsAt,
      durationMin,
    }

    delete appointmentData.date
    delete appointmentData.time

    await appointmentsService.patch(appointmentData, appointmentId)
    
    navigate(`/appointments/${appointmentId}/details`)
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
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-[#334155] dark:text-[#94A3B8]" />
                  <h1 className="text-2xl font-semibold">Edit appointment</h1>
                </div>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">
                  Adjust service, timing, and notes. Times are shown in{" "}
                  <span className="font-medium">Europe/Sofia</span>.
                </p>

                {/* UI-only form (no real submit) */}
                <form
                  className="mt-6 space-y-5"
                  key={appointment?.id || <div><Loader2 className="h-4 w-4" />Loading...</div>}
                  action={formAction}
                  noValidate
                >
                  {/* First / Last name */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="First name"
                      id="firstName"
                      name="firstName"
                      placeholder="Mila"
                      icon={<FileText className="h-4 w-4" />}
                      defaultValue={appointment?.firstName || ''}
                      />
                    <Field
                      label="Last name"
                      id="lastName"
                      name="lastName"
                      placeholder="Georgieva"
                      icon={<FileText className="h-4 w-4" />}
                      defaultValue={appointment?.lastName || ''}
                    />
                  </div>

                  {/* Service */}
                  <Field
                    label="Service"
                    id="service"
                    name="service"
                    placeholder="Contract review, Initial consultation, ..."
                    icon={<FileText className="h-4 w-4" />}
                    defaultValue={appointment?.service || ''}
                  />

                  {/* Mode (visual only) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice
                        name="mode"
                        value="In-Person"
                        title="In-Person"
                        subtitle="At the office"
                        defaultChecked={appointment?.mode === "In-Person"}
                      />
                      <Choice
                        name="mode"
                        value="Online"
                        title="Online"
                        subtitle="Video call"
                        defaultChecked={appointment?.mode === "Online"}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <Field
                    label="Date"
                    id="date"
                    name="date"
                    type="date"
                    icon={<CalendarIcon className="h-4 w-4" />}
                    hint="Format: YYYY-MM-DD"
                    defaultValue={dateAndTime.date}
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
                      start="09:00"
                      end="17:00"
                      stepMinutes={30}
                    />
                    {/* hidden input for future wiring */}
                    <input
                      type="hidden"
                      name="time"
                      value={selectedTime || ""}
                    />
                    <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                      Business hours only. Actual availability may vary by
                      bookings/spacing.
                    </p>
                  </div>

                  {/* Duration */}
                  <Field
                    label="Duration (minutes)"
                    id="durationMin"
                    name="durationMin"
                    type="number"
                    min={15}
                    max={480}
                    placeholder="120"
                    icon={<Clock className="h-4 w-4" />}
                    hint="Allowed range: 15–480. Default is 120."
                    defaultValue={appointment?.durationMin || 120}
                  />

                  {role === 'Admin' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Status</label>
                      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2">
                        <select
                          name="status"
                          defaultValue={appointment?.status}
                          className="w-full bg-transparent outline-none"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="DECLINED">Declined</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <Field
                    label="Notes (optional)"
                    id="notes"
                    name="notes"
                    placeholder="Anything we should know before the meeting?"
                    textarea
                    defaultValue={appointment?.notes || ''}
                  />

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <Link
                      to={-1}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Link>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white disabled:opacity-70"
                      title="Submit changes"
                    >
                      <Save className="h-4 w-4" />
                      Save changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Side panel */}
              <aside className="lg:col-span-2 hidden lg:block bg-[#0E1726] text-white">
                <div className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold relative pb-2">
                      Editing tips
                    </h2>
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
                    <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                      <li>Times are in Europe/Sofia (EET/EEST).</li>
                      <li>Keep duration within 15–480 minutes.</li>
                      <li>Switch between Online and In-Person as needed.</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-xs text-white/70">
                    <p>
                      Reminders (24h/1h) are based on the final start time once
                      wired to the backend.
                    </p>
                    <p>Cancelling may be restricted in the last 24h.</p>
                  </div>
                </div>
              </aside>
            </div>
          </MotionSection>
        </main>

        <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © {new Date().getFullYear()} LexSchedule. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Presentational Fields & Choices
---------------------------------------------------------- */
function Field({
  id,
  name,
  label,
  type = "text",
  placeholder = "",
  hint,
  textarea,
  min,
  max,
  defaultValue
}) {
  const common =
    "w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35]">
        {textarea ? (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            className={common}
            rows={5}
            defaultValue={defaultValue}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            className={common}
            min={min}
            max={max}
            defaultValue={defaultValue}
          />
        )}
      </div>
      {hint ? (
        <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p>
      ) : null}
    </div>
  );
}

function Choice({ name, value, defaultChecked, title, subtitle }) {
  return (
    <label
      className="flex items-start gap-3 rounded-2xl border px-3 py-3 cursor-pointer
                 border-[#E5E7EB] dark:border-[#1F2937]
                 has-[:checked]:border-[#2F80ED] has-[:checked]:bg-[rgb(47,128,237,0.08)]"
    >
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-1"
      />
      <span className="mt-0.5 text-[#334155] dark:text-[#94A3B8]" />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs opacity-80">{subtitle}</span>
      </span>
    </label>
  );
}

/* Time grid picker — UI-only */
function TimeGrid({ value, onChange, start = "09:00", end = "17:00", stepMinutes = 30 }) {
  const slots = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  for (let m = startMin; m <= endMin; m += stepMinutes) {
    const h = String(Math.floor(m / 60)).padStart(2, "0");
    const mi = String(m % 60).padStart(2, "0");
    slots.push(`${h}:${mi}`);
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {slots.map((t) => (
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
