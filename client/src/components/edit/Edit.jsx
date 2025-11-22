import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  PencilLine,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link as RRLink, useInRouterContext, useParams } from "react-router";
import appointmentsService from "../../services/appointmentsService";
import { getDateAndTimeDefaults } from "../../utils/dates";

const MotionSection = motion.section;

function SafeLink({ to, className, children }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) return <RRLink to={to} className={className}>{children}</RRLink>;
  return <a href={typeof to === "string" ? to : "#"} className={className}>{children}</a>;
}

export default function EditAppointment() {
  const { appointmentId } = useParams()
  const [appointment, setAppointment] = useState({})

  useEffect(() => {
    appointmentsService.getOne(appointmentId)
      .then(setAppointment)
  }, [appointmentId])

  const { date: defaultDate, time: defaultTime } = appointment.startsAt ? getDateAndTimeDefaults(appointment.startsAt) : { date: '', time: '' }

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Main card */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-5xl rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
          >
            <div className="grid lg:grid-cols-5">
              {/* Form side */}
              <div className="lg:col-span-3 p-6 md:p-8">
                <div className="flex items-center gap-2">
                  <PencilLine className="h-5 w-5 text-[#334155] dark:text-[#94A3B8]" />
                  <h1 className="text-2xl font-semibold">Edit appointment</h1>
                </div>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">
                  Adjust service, timing, and notes. Times are shown in <span className="font-medium">Europe/Sofia</span>.
                </p>

                <form key={appointment.id || 'loading'} className="mt-6 space-y-5" noValidate>
                  {/* Service */}
                  <Field
                    label="Service"
                    id="service"
                    name="service"
                    placeholder="Contract review, Initial consultation, ..."
                    defaultValue={appointment.service}
                  />

                  {/* Mode (now active radio like Create) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice
                        name="mode"
                        value="In-Person"
                        title="In-Person"
                        subtitle="At the office"
                        defaultChecked={appointment.mode === 'In-Person'}
                        />
                      <Choice
                        name="mode"
                        value="Online"
                        title="Online"
                        subtitle="Video call"
                        defaultChecked={appointment.mode === 'Online'}
                      />
                    </div>
                  </div>

                  {/* Date & time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Date"
                      id="date"
                      name="date"
                      type="date"
                      defaultValue={defaultDate}
                    />
                    <Field
                      label="Start time"
                      id="time"
                      name="time"
                      type="time"
                      defaultValue={defaultTime}
                    />
                  </div>

                  {/* Duration & Status */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Duration (minutes)"
                      id="duration"
                      name="duration"
                      type="number"
                      min={15}
                      max={480}
                      defaultValue={60}
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Status</label>
                      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2">
                        <select
                          name="status"
                          defaultValue={appointment.status}
                          className="w-full bg-transparent outline-none"
                        >
                          <option value='PENDING'>Pending</option>
                          <option value='CONFIRMED'>Confirmed</option>
                          <option value='CANCELLED'>Cancelled</option>
                          <option value='COMPLETED'>Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <Field
                    label="Client notes"
                    id="notes"
                    name="notes"
                    placeholder="Enter context or preparation notes"
                    textarea
                    defaultValue={appointment.notes}
                  />

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <SafeLink
                      to="/appointments"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </SafeLink>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white disabled:opacity-70"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                    Saving will validate availability and apply your 24h policy server-side.
                  </p>
                </form>
              </div>

              {/* Side panel */}
              <aside className="lg:col-span-2 hidden lg:block bg-[#0E1726] text-white">
                <div className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold relative pb-2">Editing tips</h2>
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
                    <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                      <li>Times are in Europe/Sofia (EET/EEST).</li>
                      <li>Keep duration within 15–480 minutes.</li>
                      <li>Switch between Online and In-Person as needed.</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-xs text-white/70">
                    <p>We’ll send reminders (24h/1h) based on your chosen time.</p>
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
   Presentational Fields & Choices (active)
---------------------------------------------------------- */
function Field({
  id,
  name,
  label,
  type = "text",
  placeholder = "",
  hint,
  defaultValue,
  textarea,
  min,
  max,
}) {
  const common = "w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
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
            defaultValue={defaultValue}
            min={min}
            max={max}
          />
        )}
      </div>
      {hint ? <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p> : null}
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
