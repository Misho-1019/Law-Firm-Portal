import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import { Link as RRLink, useInRouterContext } from "react-router-dom";

const MotionSection = motion.section;

/** SafeLink — works with or without Router. Falls back to <a>. */
function SafeLink({ to, className, children, title }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) return <RRLink to={to} className={className} title={title}>{children}</RRLink>;
  return <a href={typeof to === "string" ? to : "#"} className={className} title={title}>{children}</a>;
}

/**
 * Schedule.jsx — Weekly calendar overview (UI-only)
 * Palette matches create.jsx
 * - Light bg: #F5F7FA; Dark bg: #0E1726
 * - Primary: #2F80ED (hover #266DDE; ring rgba(47,128,237,0.40))
 * - Borders: #E5E7EB (light) / #1F2937 (dark)
 * - Subtle text: #334155 (light) / #94A3B8 (dark)
 */
export default function SchedulePage() {
  // Reference date anchors the visible week (defaults to today)
  const [anchor, setAnchor] = useState(() => new Date());
  const week = useMemo(() => computeWeek(anchor), [anchor]);

  // Dummy data (UI-only)
  const data = useMemo(() => sampleData(week.daysAtMidnight), [week.daysAtMidnight]);

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between">
            <nav className="text-sm text-[#334155] dark:text-[#94A3B8] flex items-center gap-2">
              <SafeLink to="/" className="hover:underline">Home</SafeLink>
              <span className="h-4 w-[1px] bg-[#E5E7EB] dark:bg-[#1F2937] mx-1" />
              <SafeLink to="/appointments" className="hover:underline">Appointments</SafeLink>
              <span className="h-4 w-[1px] bg-[#E5E7EB] dark:bg-[#1F2937] mx-1" />
              <span className="font-medium text-[#0B1220] dark:text-white">Schedule</span>
            </nav>

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <SafeLink
                to="/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.40]"
                title="Create appointment"
              >
                <Plus className="h-4 w-4" /> New
              </SafeLink>
              <SafeLink
                to="/book"
                className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-3 py-2.5 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                title="Browse availability"
              >
                <CalendarIcon className="h-4 w-4" /> Book
              </SafeLink>
            </div>
          </div>
        </header>

        {/* Main card */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-6xl rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] dark:border-[#1F2937] p-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAnchor(addDays(anchor, -7))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-3 py-2 border border-[#E5E7EB] dark:border-[#1F2937] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="h-4 w-4" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => setAnchor(new Date())}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-3 py-2 border border-[#E5E7EB] dark:border-[#1F2937] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setAnchor(addDays(anchor, 7))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-3 py-2 border border-[#E5E7EB] dark:border-[#1F2937] hover:bg:black/5 dark:hover:bg:white/5"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-sm text-[#334155] dark:text-[#94A3B8] flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {fmtDate(week.daysAtMidnight[0])} — {fmtDate(week.daysAtMidnight[6])}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4 py-3 text-xs text-[#334155] dark:text-[#94A3B8] border-b border-[#E5E7EB] dark:border-[#1F2937]">
              <LegendSwatch className="bg-[#2F80ED]/15 border-[#2F80ED]" label="Booked" />
              <LegendSwatch className="bg-[#EF4444]/15 border-[#EF4444]" label="Time off" />
              <LegendSwatch className="bg-transparent border-dashed" label="Free" />
            </div>

            {/* Week grid */}
            <div className="grid grid-cols-7 gap-px bg-[#E5E7EB] dark:bg-[#1F2937]">
              {week.daysAtMidnight.map((d, idx) => (
                <DayColumn key={idx} date={d} items={data[isoDate(d)] || []} />
              ))}
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

/* ------------------------------ Subcomponents ------------------------------ */
function LegendSwatch({ className = "", label }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded border ${className}`} />
      <span>{label}</span>
    </div>
  );
}

function DayColumn({ date, items }) {
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);
  const day = date.getDate();
  return (
    <div className="bg-white dark:bg-[#111827]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <div className="text-xs text-[#334155] dark:text-[#94A3B8]">{weekday}</div>
        <div className="text-sm font-semibold">{String(day).padStart(2, "0")}</div>
      </div>
      <div className="min-h-[12rem] p-2 space-y-2">
        {items.length === 0 ? (
          <div className="h-20 rounded-2xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] text-xs text-[#334155] dark:text-[#94A3B8] grid place-items-center">
            Free day
          </div>
        ) : (
          items.map((it) => <EventChip key={it.id} item={it} />)
        )}
      </div>
    </div>
  );
}

function EventChip({ item }) {
  const isBooked = item.type === "appointment";
  const isOff = item.type === "timeoff";
  const base = "rounded-2xl border px-3 py-2 text-sm";
  const cls = isBooked
    ? `${base} border-[#2F80ED] bg-[rgb(47,128,237,0.08)]`
    : isOff
    ? `${base} border-[#EF4444] bg-[rgb(239,68,68,0.08)]`
    : `${base} border-[#E5E7EB] dark:border-[#1F2937]`;

  const time = `${pad2(item.start[0])}:${pad2(item.start[1])} – ${pad2(item.end[0])}:${pad2(item.end[1])}`;

  return (
    <div className={cls}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#94A3B8]">
            <Clock className="h-3.5 w-3.5" /> {time}
          </div>
          <div className="mt-0.5 font-semibold truncate">{item.title}</div>
          {item.note ? (
            <div className="text-xs text-[#334155] dark:text-[#94A3B8] truncate">{item.note}</div>
          ) : null}
        </div>
        {isBooked ? (
          <SafeLink
            to={`/appointments/${item.id}`}
            className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-[#2F80ED] px-2 py-1 text-xs font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-2 focus:ring-[rgb(47,128,237)/0.40]"
            title="Open details"
          >
            <LinkIcon className="h-3 w-3" /> Details
          </SafeLink>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------------- Helpers -------------------------------- */
function computeWeek(anchorDate) {
  const d = new Date(anchorDate);
  // Normalize to midnight
  d.setHours(0, 0, 0, 0);
  // Find Monday of the current week (Mon–Sun)
  const day = d.getDay(); // 0 Sun, 1 Mon, ...
  const diffToMonday = (day + 6) % 7; // 0 for Mon, 6 for Sun
  const monday = addDays(d, -diffToMonday);
  const daysAtMidnight = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  return { daysAtMidnight };
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isoDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fmtDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function pad2(n) { return String(n).padStart(2, "0"); }

function sampleData(days) {
  // Build a dictionary keyed by YYYY-MM-DD with sample items
  const map = {};
  for (const day of days) {
    const key = isoDate(day);
    map[key] = [];
  }
  // Example appointments and time off
  const add = (d, item) => {
    const key = isoDate(d);
    map[key].push(item);
  };

  // Use the first, third, and fifth days for variety
  if (days[0]) add(days[0], { id: "appt_100", type: "appointment", title: "Initial consultation", start: [9, 0], end: [10, 0], note: "John Doe" });
  if (days[0]) add(days[0], { id: "off_a", type: "timeoff", title: "Court hearing", start: [14, 0], end: [16, 0], note: "Downtown court" });

  if (days[2]) add(days[2], { id: "appt_200", type: "appointment", title: "Contract review", start: [11, 30], end: [12, 30], note: "ACME Ltd." });

  if (days[4]) add(days[4], { id: "off_b", type: "timeoff", title: "Admin day", start: [0, 0], end: [23, 59], note: "Full day" });

  return map;
}

