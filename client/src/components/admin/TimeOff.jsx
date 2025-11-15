import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Clock,
  Plane,
  BedDouble,
  Briefcase,
  XCircle,
  NotepadText,
} from "lucide-react";
import { Link as RRLink, useInRouterContext } from "react-router-dom";

const MotionSection = motion.section;

/**
 * SafeLink — works with or without Router. Falls back to <a> if no router context.
 */
function SafeLink({ to, className, children }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) return <RRLink to={to} className={className}>{children}</RRLink>;
  return (
    <a href={typeof to === "string" ? to : "#"} className={className}>
      {children}
    </a>
  );
}

/**
 * TimeOff.jsx — Block unavailable time (UI-only)
 * Palette matches create.jsx / book.jsx
 * - Light bg: #F5F7FA; Dark bg: #0E1726
 * - Primary: #2F80ED (hover #266DDE, ring rgba(47,128,237,0.40))
 * - Borders: #E5E7EB (light) / #1F2937 (dark)
 * - Subtle text: #334155 (light) / #94A3B8 (dark)
 */
export default function TimeOffPage() {
  const [mode, setMode] = useState("Full Day"); // "Full Day" | "Partial Day"
  const [startDate, setStartDate] = useState(isoToday());
  const [endDate, setEndDate] = useState(isoToday());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("Vacation");
  const [notes, setNotes] = useState("");

  const isPartial = mode === "Partial Day";

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Breadcrumb */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="text-sm text-[#334155] dark:text-[#94A3B8] flex items-center gap-2">
            <SafeLink to="/" className="hover:underline">Home</SafeLink>
            <span className="h-4 w-[1px] bg-[#E5E7EB] dark:bg-[#1F2937] mx-1" />
            <SafeLink to="/appointments" className="hover:underline">Appointments</SafeLink>
            <span className="h-4 w-[1px] bg-[#E5E7EB] dark:bg-[#1F2937] mx-1" />
            <span className="font-medium text-[#0B1220] dark:text-white">Time off</span>
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
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-2xl font-semibold">Block time off</h1>
                  <SafeLink
                    to="/appointments"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </SafeLink>
                </div>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">
                  Mark days or hours when new bookings are not allowed.
                </p>

                <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()} noValidate>
                  {/* Mode */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Choice
                        selected={mode === "Full Day"}
                        onClick={() => setMode("Full Day")}
                        icon={<BedDouble className="h-4 w-4" />}
                        title="Full Day"
                        subtitle="Whole days"
                      />
                      <Choice
                        selected={mode === "Partial Day"}
                        onClick={() => setMode("Partial Day")}
                        icon={<Clock className="h-4 w-4" />}
                        title="Partial Day"
                        subtitle="Specific hours"
                      />
                    </div>
                  </div>

                  {/* Date range */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Start date"
                      id="startDate"
                      type="date"
                      icon={<CalendarIcon className="h-4 w-4" />}
                      value={startDate}
                      onChange={setStartDate}
                    />
                    <Field
                      label="End date"
                      id="endDate"
                      type="date"
                      icon={<CalendarIcon className="h-4 w-4" />}
                      value={endDate}
                      onChange={setEndDate}
                    />
                  </div>

                  {/* Time range (shown for Partial Day) */}
                  <div className={`grid md:grid-cols-2 gap-4 transition-opacity ${isPartial ? "opacity-100" : "opacity-50"}`}>
                    <Field
                      label="Start time"
                      id="startTime"
                      type="time"
                      icon={<Clock className="h-4 w-4" />}
                      value={startTime}
                      onChange={setStartTime}
                      disabled={!isPartial}
                    />
                    <Field
                      label="End time"
                      id="endTime"
                      type="time"
                      icon={<Clock className="h-4 w-4" />}
                      value={endTime}
                      onChange={setEndTime}
                      disabled={!isPartial}
                    />
                  </div>

                  {/* Reason */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Reason</label>
                    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35]">
                      <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]">
                        <NotepadText className="h-4 w-4" />
                        <select className="w-full bg-transparent outline-none" value={reason} onChange={(e) => setReason(e.target.value)}>
                          <option>Vacation</option>
                          <option>Sick leave</option>
                          <option>Admin day</option>
                          <option>Court hearing</option>
                          <option>Personal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <Field
                    label="Notes (optional)"
                    id="notes"
                    textarea
                    placeholder="Any context for this time off?"
                    value={notes}
                    onChange={setNotes}
                  />

                  {/* CTA */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-disabled
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.40] pointer-events-none opacity-60"
                      title="Disabled in UI-only mode"
                    >
                      <Save className="h-4 w-4" /> Save block
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg:white/5"
                      onClick={() => {
                        setMode("Full Day");
                        const today = isoToday();
                        setStartDate(today);
                        setEndDate(today);
                        setStartTime("09:00");
                        setEndTime("17:00");
                        setReason("Vacation");
                        setNotes("");
                      }}
                    >
                      <XCircle className="h-4 w-4" /> Reset
                    </button>
                  </div>

                  <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                    UI preview only. In production, this would POST to /timeoff (or /availability/block) and invalidate slot generation.
                  </p>
                </form>
              </div>

              {/* Side panel */}
              <aside className="lg:col-span-2 bg-[#0E1726] text-white p-6 md:p-7">
                <h2 className="text-lg font-semibold">Tips</h2>
                <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent my-2" />
                <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
                  <li>Full Day blocks affect entire days between start and end dates.</li>
                  <li>Partial Day blocks apply for the selected hours only.</li>
                  <li>Consider recurring patterns (e.g., every Friday afternoon).</li>
                </ul>

                {/* Demo preview of what will be blocked (UI-only) */}
                <div className="mt-6 rounded-2xl border border-white/10 p-4">
                  <h3 className="text-sm font-semibold">Preview</h3>
                  <div className="mt-2 text-sm text-white/90">
                    <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> {startDate} → {endDate}</div>
                    {isPartial ? (
                      <div className="flex items-center gap-2 mt-1"><Clock className="h-4 w-4" /> {startTime} – {endTime}</div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1"><BedDouble className="h-4 w-4" /> Full days</div>
                    )}
                    <div className="flex items-center gap-2 mt-1"><Briefcase className="h-4 w-4" /> {reason}</div>
                    {notes ? <div className="mt-1 text-xs text-white/70">{notes}</div> : null}
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

/* ------------------------------- Reusable UI ------------------------------- */
function Field({ id, label, type = "text", icon, value, onChange, placeholder = "", disabled, textarea }) {
  const common = "w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className={`rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35] ${disabled ? "opacity-60" : ""}`}>
        <div className="flex items-center gap-2">
          {icon ? <span className="text-[#334155] dark:text-[#94A3B8]">{icon}</span> : null}
          {textarea ? (
            <textarea
              id={id}
              placeholder={placeholder}
              className={common}
              rows={5}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
            />
          ) : (
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              className={common}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
            />
          )}
        </div>
      </div>
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

/* ------------------------------- Helpers ------------------------------- */
function isoToday() {
  const dt = new Date();
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

