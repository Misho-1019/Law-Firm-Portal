import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, FileText, MapPin, MonitorSmartphone, DoorOpen, ArrowRight, ChevronRight } from "lucide-react";

const MotionSection = motion.section;

/**
 * UI-only Create Appointment page (clients & admins)
 * Router-free so it renders even without <Router> context in previews/tests.
 * - Matches the register page color system
 * - No data fetching or submission logic wired yet
 * - Reads optional prefilled params from the URL (?startsAtLocal=&durationMin=&service=&mode=)
 */
export default function CreateAppointmentPage() {
  const qp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

  // Prefills from URL if coming from /book
  const [service, setService] = useState(qp.get("service") || "");
  const [mode, setMode] = useState(qp.get("mode") || "Online");
  const [startsAtLocal, setStartsAtLocal] = useState(qp.get("startsAtLocal") || "");
  const [durationMin, setDurationMin] = useState(qp.get("durationMin") || "60");
  const [timezone, setTimezone] = useState("Europe/Sofia");
  const [notes, setNotes] = useState("");

  const onDummySubmit = (e) => {
    e.preventDefault();
    // UI-only: in a real app you'd submit to /appointments/create and navigate via SPA routing.
    // Using location.assign keeps this component router-agnostic for previews/tests.
    if (typeof window !== "undefined") {
      window.location.assign("/appointments");
    }
  };

  const bookHref = `/book?durationMin=${encodeURIComponent(durationMin)}`;

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Header crumb */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="text-sm text-[#334155] dark:text-[#94A3B8] flex items-center gap-2">
            <a href="/" className="hover:underline">Home</a>
            <ChevronRight className="h-4 w-4 opacity-60" />
            <span className="opacity-80">Appointments</span>
            <ChevronRight className="h-4 w-4 opacity-60" />
            <span className="font-medium text-[#0B1220] dark:text-white">Create</span>
          </nav>
        </header>

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
                <h1 className="text-2xl font-semibold">Create an appointment</h1>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">
                  Choose a time that works for you. Times are shown in <span className="font-medium">Europe/Sofia</span>.
                </p>

                <form className="mt-6 space-y-5" onSubmit={onDummySubmit} noValidate>
                  {/* Service */}
                  <Field
                    label="Service"
                    id="service"
                    name="service"
                    placeholder="Initial consultation, Contract review, ..."
                    icon={<FileText className="h-4 w-4" />}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  />

                  {/* Mode */}
                  <div className="space-y-1.5">
                    <label htmlFor="mode" className="text-sm font-medium">Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice
                        selected={mode === "Online"}
                        onClick={() => setMode("Online")}
                        icon={<MonitorSmartphone className="h-4 w-4" />}
                        title="Online"
                        subtitle="Video call"
                      />
                      <Choice
                        selected={mode === "In-Person"}
                        onClick={() => setMode("In-Person")}
                        icon={<MapPin className="h-4 w-4" />}
                        title="In-Person"
                        subtitle="At the office"
                      />
                    </div>
                  </div>

                  {/* Date & time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Start (local)"
                      id="startsAtLocal"
                      name="startsAtLocal"
                      type="datetime-local"
                      icon={<CalendarIcon className="h-4 w-4" />}
                      value={startsAtLocal}
                      onChange={(e) => setStartsAtLocal(e.target.value)}
                      hint="Format: YYYY-MM-DDTHH:mm:ss"
                    />
                    <Field
                      label="Duration (minutes)"
                      id="durationMin"
                      name="durationMin"
                      type="number"
                      icon={<Clock className="h-4 w-4" />}
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      placeholder="60"
                      hint="15–480"
                      min={15}
                      max={480}
                      step={15}
                    />
                  </div>

                  {/* Timezone & helper */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Timezone"
                      id="timezone"
                      name="timezone"
                      placeholder="Europe/Sofia"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      icon={<DoorOpen className="h-4 w-4" />}
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Need a slot?</label>
                      <a
                        href={bookHref}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
                      >
                        Browse availability
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                        Pick a slot on the calendar; we’ll prefill the time here.
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  <Field
                    label="Notes (optional)"
                    id="notes"
                    name="notes"
                    placeholder="Anything we should know before the meeting?"
                    icon={<FileText className="h-4 w-4" />}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  {/* CTA */}
                  <button
                    type="submit"
                    className="relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
                    aria-label="Create appointment"
                  >
                    Create appointment
                    <ArrowRight className="h-4 w-4" />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                  </button>

                  <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                    This is a UI preview. Actual booking will validate availability and enforce your 24h policy.
                  </p>
                </form>
              </div>

              {/* Side panel */}
              <aside className="lg:col-span-2 hidden lg:block bg-[#0E1726] text-white">
                <div className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold relative pb-2">Booking tips</h2>
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
                    <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                      <li>Times are in Europe/Sofia (EET/EEST).</li>
                      <li>Use the calendar to avoid taken slots.</li>
                      <li>Duration can be 15–480 minutes.</li>
                      <li>Online or In-Person—your choice.</li>
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
   Presentational Fields & Choices (UI-only)
---------------------------------------------------------- */
function Field({ id, name, label, icon, type = "text", placeholder = "", hint, value, onChange, min, max, step }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35]">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-[#334155] dark:text-[#94A3B8]">{icon}</span> : null}
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
      {hint ? <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p> : null}
    </div>
  );
}

function Choice({ selected, onClick, icon, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-colors focus:outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.35]
        ${selected ? "border-[#2F80ED] bg-[rgb(47,128,237,0.08)] dark:border-[#2F80ED]" : "border-[#E5E7EB] dark:border-[#1F2937]"}`}
      aria-pressed={selected}
    >
      <span className="mt-0.5 text-[#334155] dark:text-[#94A3B8]">{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs opacity-80">{subtitle}</span>
      </span>
    </button>
  );
}
