/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import { Link, Link as RRLink, useInRouterContext, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { formatSofiaDate } from "../../utils/dates";
import { useCalendarWeek } from "../../api/scheduleApi";

const MotionSection = motion.section;

/** SafeLink — works with or without Router. Falls back to <a>. */
function SafeLink({ to, className, children, title }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter)
    return (
      <RRLink to={to} className={className} title={title}>
        {children}
      </RRLink>
    );
  return (
    <a
      href={typeof to === "string" ? to : "#"}
      className={className}
      title={title}
    >
      {children}
    </a>
  );
}

/**
 * Schedule.jsx — Weekly calendar overview (UI-only)
 * Palette matches create.jsx
 */
export default function SchedulePage() {
  const { role } = useAuth()
  // Reference date anchors the visible week (defaults to today)
  const [anchor, setAnchor] = useState(() => new Date());
  const week = useMemo(() => computeWeek(anchor), [anchor]);

  const daysRange = week.daysAtMidnight || []
  const from = daysRange[0] ? fmtDate(daysRange[0]) : null
  const to = daysRange[6] ? fmtDate(daysRange[6]) : null

  const { weekData, isLoading, error } = useCalendarWeek(from, to)

  const data = useMemo(() => {
    const byDate = {};

    (weekData?.days || []).forEach((day) => {
      byDate[day.date] = (day.items || []).map((it) => ({
        id: it.id,
        type: it.type,
        title: it.title,
        start: it.startTime.split(':').map(Number),
        end: it.endTime.split(':').map(Number),
        note: it.note,
        creator: it.creator,
      }))
    })
    
    return byDate;
  }, [weekData])

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Header */}
        <header className="px-6 sm:px-8 lg:px-10 pt-8">
          <div className="flex items-center justify-between">
            {/* Quick actions */}
            <div className="flex items-center gap-3">
              <SafeLink
                to="/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.40]"
                title="Create appointment"
              >
                <Plus className="h-5 w-5" /> New
              </SafeLink>
              { role === 'Admin' ? (
                <SafeLink
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-3 text-sm sm:text-base font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                  title="Browse availability"
                >
                  <CalendarIcon className="h-5 w-5" /> My Dashboard
                </SafeLink>
              ) : (
                <div className="flex justify-between gap-3">
                  <SafeLink
                    to="/client"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-3 text-sm sm:text-base font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                    title="Browse availability"
                    >
                    <CalendarIcon className="h-5 w-5" /> My Appointments
                  </SafeLink>
                  <a
                    href="viber://chat?number=%2B359889116617"
                    className="
                      inline-flex items-center gap-2 rounded-2xl 
                      border border-[#E5E7EB] dark:border-[#1F2937] 
                      px-4 py-3 text-sm sm:text-base font-semibold
                      text-[#7C3AED] dark:text-[#A855F7]
                      bg-white dark:bg-[#0F172A]
                      hover:bg-[#F5F3FF] dark:hover:bg-[#1E1B4B]
                      transition-colors
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M18.5 3h-13A2.5 2.5 0 003 5.5v13.086l2.793-2.793A1 1 0 016.5 15.5h12A2.5 2.5 0 0021 13V5.5A2.5 2.5 0 0018.5 3zm-4.04 10.013c-.79.79-2.98.066-4.63-1.584-1.65-1.65-2.373-3.84-1.584-4.63.21-.21.53-.33.95-.33.27 0 .57.05.9.15a.75.75 0 01.52.53l.26 1.03a.75.75 0 01-.19.7l-.57.57c.21.55.69 1.17 1.16 1.64.47.47 1.09.95 1.64 1.16l.57-.57a.75.75 0 01.7-.19l1.03.26a.75.75 0 01.53.52c.2.76.22 1.35-.08 1.65z" />
                    </svg>
                    Chat on Viber
                  </a>
                  <a
                    href="tel:+359889116617"
                    className="
                      inline-flex items-center gap-2 rounded-2xl 
                      border border-[#E5E7EB] dark:border-[#1F2937] 
                      px-4 py-2 text-sm font-semibold
                      text-[#2F80ED] dark:text-[#60A5FA]
                      bg-white dark:bg-[#0F172A]
                      hover:bg-[#F0F6FF] dark:hover:bg-[#1E293B] 
                      transition-colors
                    "
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 5.25c0-.966.784-1.75 1.75-1.75h2.086c.696 0 1.31.403 1.58 1.026l.933 2.18a1.75 1.75 0 01-.402 1.93l-1.172 1.171a14.95 14.95 0 006.313 6.313l1.17-1.171a1.75 1.75 0 011.93-.402l2.181.933c.623.27 1.026.884 1.026 1.58V19.25c0 .966-.784 1.75-1.75 1.75H18.75c-8.284 0-15-6.716-15-15V5.25z'
                      />
                    </svg>
                    Call us: +359 889 116 617
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main card */}
        <main className="flex-1 flex items-center justify-center px-6 lg:px-10 py-12">
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-7xl rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden min-h-[480px]"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-[#1F2937] p-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAnchor(addDays(anchor, -7))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 text-sm border border-[#E5E7EB] dark:border-[#1F2937] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="h-4 w-4" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => setAnchor(new Date())}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 text-sm border border-[#E5E7EB] dark:border-[#1F2937] hover:bg-black/5 dark:hover:bg:white/5"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setAnchor(addDays(anchor, 7))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 text-sm border border-[#E5E7EB] dark:border-[#1F2937] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-sm sm:text-base text-[#334155] dark:text-[#94A3B8] flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>
                  {fmtDate(week.daysAtMidnight[0])} — {fmtDate(week.daysAtMidnight[6])}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 px-5 py-4 text-sm text-[#334155] dark:text-[#94A3B8] border-b border-[#E5E7EB] dark:border-[#1F2937]">
              <LegendSwatch className="bg-[#2F80ED]/15 border-[#2F80ED]" label="Booked" />
              <LegendSwatch className="bg-[#EF4444]/15 border-[#EF4444]" label="Time off" />
              <LegendSwatch className="bg-transparent border-dashed" label="Free" />
            </div>

            {isLoading && (
              <div className="px-5 py-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                Loading schedule…
              </div>
            )}

            {error && !isLoading && (
              <div className="px-5 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Week grid */}
            <div className="grid grid-cols-7 gap-px bg-[#E5E7EB] dark:bg-[#1F2937]">
              {week.daysAtMidnight.map((d, idx) => (
                <DayColumn key={idx} date={d} items={data[isoDate(d)] || []} />
              ))}
            </div>
          </MotionSection>
        </main>

        <footer className="py-7 text-center text-sm sm:text-base text-[#334155] dark:text-[#94A3B8]">
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
      <span className={`h-3.5 w-3.5 rounded border ${className}`} />
      <span>{label}</span>
    </div>
  );
}

function DayColumn({ date, items }) {
  const navigate = useNavigate()
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);
  const day = date.getDate();
  const [ month, d, year ] = String(formatSofiaDate(date)).split('/');
  const validDate = `${year}-${month}-${d}`;

  const handleDayClick = () => {
    navigate(`/day/${validDate}`)
  }
  
  
  return (
    <div onClick={handleDayClick} role="button" tabIndex={0} className="bg-white dark:bg-[#111827]">
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{weekday}</div>
        <div className="text-base font-semibold">
          {String(day).padStart(2, "0")}
        </div>
      </div>
      <div className="min-h-[16rem] p-3 space-y-3">
        {items.length === 0 ? (
          <div className="h-24 rounded-2xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] text-sm text-[#334155] dark:text-[#94A3B8] grid place-items-center">
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
  const { role, userId } = useAuth()
  const isAdmin = role === 'Admin';
  const isOwner = role === 'Client' && item?.creator === userId;
  const isBooked = item.type === "appointment";
  const isOff = item.type === "timeoff";
  const base = "rounded-2xl border px-3.5 py-2.5 text-sm sm:text-base";
  const cls = isBooked
    ? `${base} border-[#2F80ED] bg-[rgb(47,128,237,0.08)]`
    : isOff
    ? `${base} border-[#EF4444] bg-[rgb(239,68,68,0.08)]`
    : `${base} border-[#E5E7EB] dark:border-[#1F2937]`;

  const time = `${pad2(item.start[0])}:${pad2(item.start[1])} – ${pad2(item.end[0])}:${pad2(item.end[1])}`;

  return (
    <div className={cls}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#334155] dark:text-[#94A3B8]">
            <Clock className="h-4 w-4" /> {time}
          </div>
          <div className="mt-1 font-semibold truncate">{item.title}</div>
          {item.note ? (
            <div className="text-xs sm:text-sm text-[#334155] dark:text-[#94A3B8] truncate">
              {item.note}
            </div>
          ) : null}
        </div>
        {isBooked && (isAdmin || isOwner) ? (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <SafeLink
              to={`/appointments/${item.id}/details`}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#2F80ED] px-3 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-2 focus:ring-[rgb(47,128,237)/0.40]"
              title="Open details"
              >
              <LinkIcon className="h-3.5 w-3.5" />
            </SafeLink>
          </div>
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

function pad2(n) {
  return String(n).padStart(2, "0");
}