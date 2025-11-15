import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ArrowLeft, ArrowRight, Filter, MapPin, MonitorSmartphone } from "lucide-react";
import { Link as RRLink, useInRouterContext } from "react-router-dom";

const MotionSection = motion.section;

/**
 * SafeLink — works with or without Router. Falls back to <a> if no router context.
 */
function SafeLink({ to, className, children }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) return <RRLink to={to} className={className}>{children}</RRLink>;
  return <a href={typeof to === "string" ? to : "#"} className={className}>{children}</a>;
}

/**
 * book.jsx — Browse & pick a time slot (UI-only)
 * Palette matches create.jsx
 * - Light bg: #F5F7FA; Dark bg: #0E1726
 * - Primary: #2F80ED (hover #266DDE, ring rgba(47,128,237,0.40))
 * - Borders: #E5E7EB (light) / #1F2937 (dark)
 * - Subtle text: #334155 (light) / #94A3B8 (dark)
 */
export default function BookSlotsPage() {
  // Filters (UI-only)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [durationMin, setDurationMin] = useState("60");
  const [mode, setMode] = useState("Online");
  const [timezone] = useState("Europe/Sofia");

  // Dummy slots generator — returns 30-min spaced slots between 09:00–17:00 for the chosen day
  const slots = useMemo(() => generateSlots(date, 9, 17, 30), [date]);

  const toCreateHref = (isoLocal) =>
    `/create?startsAtLocal=${encodeURIComponent(isoLocal)}&durationMin=${encodeURIComponent(durationMin)}&mode=${encodeURIComponent(mode)}&service=`;

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Header crumb */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="text-sm text-[#334155] dark:text-[#94A3B8] flex items-center gap-2">
            <SafeLink to="/" className="hover:underline">Home</SafeLink>
            <span className="h-4 w-[1px] bg-[#E5E7EB] dark:bg-[#1F2937] mx-1" />
            <SafeLink to="/appointments" className="hover:underline">Appointments</SafeLink>
            <span className="h-4 w-[1px] bg-[#E5E7EB] dark:bg-[#1F2937] mx-1" />
            <span className="font-medium text-[#0B1220] dark:text-white">Browse availability</span>
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
              {/* Control panel */}
              <aside className="lg:col-span-2 p-6 md:p-7 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] dark:border-[#1F2937] bg-white/60 dark:bg-[#111827]">
                <h1 className="text-xl font-semibold flex items-center gap-2"><Filter className="h-5 w-5" /> Filter slots</h1>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">Times shown in <span className="font-medium">{timezone}</span>.</p>

                {/* Date */}
                <div className="mt-5 space-y-1.5">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35] flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                    <input
                      id="date"
                      type="date"
                      className="w-full bg-transparent outline-none"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="mt-4 space-y-1.5">
                  <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
                  <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35] flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                    <input
                      id="duration"
                      type="number"
                      min={15}
                      max={480}
                      step={15}
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Mode */}
                <div className="mt-4 space-y-1.5">
                  <label className="text-sm font-medium">Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <ModeChoice selected={mode === "Online"} onClick={() => setMode("Online")} icon={<MonitorSmartphone className="h-4 w-4" />} title="Online" subtitle="Video call" />
                    <ModeChoice selected={mode === "In-Person"} onClick={() => setMode("In-Person")} icon={<MapPin className="h-4 w-4" />} title="In-Person" subtitle="At the office" />
                  </div>
                </div>

                <div className="mt-6 text-xs text-[#334155] dark:text-[#94A3B8]">
                  Selecting a slot will take you to the Create page with time and duration prefilled.
                </div>

                <div className="mt-6">
                  <SafeLink
                    to="/appointments"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Appointments
                  </SafeLink>
                </div>
              </aside>

              {/* Slots list */}
              <section className="lg:col-span-3 p-6 md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Available slots</h2>
                  <div className="text-sm text-[#334155] dark:text-[#94A3B8] flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" /> {fmtDate(date)}
                  </div>
                </div>

                {slots.length === 0 ? (
                  <EmptyState date={date} />
                ) : (
                  <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {slots.map((iso) => (
                      <SlotCard key={iso} isoLocal={iso} href={toCreateHref(iso)} durationMin={durationMin} />
                    ))}
                  </div>
                )}

                {/* Pager (UI-only) */}
                <div className="mt-6 flex items-center justify-between text-sm text-[#334155] dark:text-[#94A3B8]">
                  <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-3 py-2 border border-[#E5E7EB] dark:border-[#1F2937] hover:bg-black/5 dark:hover:bg-white/5" disabled title="UI-only">
                    <ArrowLeft className="h-4 w-4" /> Previous day
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-3 py-2 border border-[#E5E7EB] dark:border-[#1F2937] hover:bg-black/5 dark:hover:bg-white/5" disabled title="UI-only">
                    Next day <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-6 text-xs text-[#334155] dark:text-[#94A3B8]">
                  This is a UI preview. In production, slots would be fetched from your availability API and filtered by duration/mode.
                </p>
              </section>
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

/* ------------------------------- Subcomponents ------------------------------- */
function ModeChoice({ selected, onClick, icon, title, subtitle }) {
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

function SlotCard({ isoLocal, href, durationMin }) {
  const t = fmtTime(isoLocal);
  const d = fmtDate(isoLocal.slice(0, 10));
  return (
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{d}</div>
          <div className="text-lg font-semibold">{t}</div>
        </div>
        <div className="text-xs text-[#334155] dark:text-[#94A3B8] inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {durationMin} min</div>
      </div>
      <SafeLink
        to={href}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.40]"
        aria-label={`Use ${t} slot`}
      >
        Use this slot
        <ArrowRight className="h-4 w-4" />
      </SafeLink>
    </div>
  );
}

function EmptyState({ date }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] p-8 text-center">
      <div className="text-sm text-[#334155] dark:text-[#94A3B8]">No available slots on {fmtDate(date)}.</div>
      <div className="mt-2 text-xs text-[#334155] dark:text-[#94A3B8]">Try another date or reduce the duration.</div>
    </div>
  );
}

/* ------------------------------- Helpers ------------------------------- */
function generateSlots(yyyyMmDd, startHour, endHour, stepMin) {
  try {
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    const slots = [];
    for (let h = startHour; h < endHour; h++) {
      for (let min = 0; min < 60; min += stepMin) {
        const dt = new Date(y, (m - 1), d, h, min, 0);
        // Format as local ISO (YYYY-MM-DDTHH:mm)
        const isoLocal = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}T${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
        slots.push(isoLocal);
      }
    }
    // In a real app, you would filter out taken slots here.
    return slots;
  } catch {
    return [];
  }
}

function fmtDate(yyyyMmDd) {
  try {
    const dt = new Date(yyyyMmDd);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return yyyyMmDd || "";
  }
}

function fmtTime(isoLocal) {
  try {
    const dt = new Date(isoLocal);
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${hh}:${mi}`;
  } catch {
    return isoLocal;
  }
}
