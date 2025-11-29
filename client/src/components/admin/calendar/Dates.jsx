import { useMemo, useState } from "react";
import { Link } from "react-router";

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function mondayFirst(d) {
  return (d.getDay() + 6) % 7;
}

function getWeeks(year, month) {
  const first = new Date(year, month, 1);
  const pad = mondayFirst(first);
  const start = new Date(year, month, 1 - pad);
  const weeks = [];
  const cur = new Date(start);
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      row.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ---- Robust Sofia day keys ---- */
const SOFIA_TZ = "Europe/Sofia";

// Convert a real instant (Date with offset) to Sofia "YYYY-MM-DD"
const keyFromInstantSofia = (date) =>
  date.toLocaleDateString("en-CA", { timeZone: SOFIA_TZ });

// Build a cell key from Y/M/D at UTC noon, then format in Sofia
const keyFromPartsSofia = (y, m, d) =>
  new Date(Date.UTC(y, m, d, 12, 0, 0)).toLocaleDateString("en-CA", {
    timeZone: SOFIA_TZ,
  });

export default function Dates({ appointments = [], timeOff = [] }) {
  const now = useMemo(() => new Date(), []);
  const [current, setCurrent] = useState({
    y: now.getFullYear(),
    m: now.getMonth(),
  });
  const [selected, setSelected] = useState(now);

  const weeks = useMemo(() => getWeeks(current.y, current.m), [current]);

  const prevMonth = () =>
    setCurrent(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }));
  const nextMonth = () =>
    setCurrent(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }));

  const headerLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(current.y, current.m, 1));

  // Count appointments per Sofia day
  const apptCountByDay = useMemo(() => {
    const m = new Map();
    const confirmed = appointments.filter((x) => x.status === "CONFIRMED");
    for (const a of confirmed) {
      const raw = a?.startsAt;
      if (!raw) continue;

      // Backend should send with offset (e.g. +02:00 / +03:00)
      const key = keyFromInstantSofia(new Date(raw));
      m.set(key, (m.get(key) || 0) + 1);
    }
    return m;
  }, [appointments]);

  return (
    <div>
      <div className="flex items-center justify-between p-4 pb-3">
        <div>
          <h2 className="text-lg font-semibold">This month</h2>
          <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
            {headerLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
          >
            Prev
          </button>
          <button
            onClick={() => {
              const d = new Date();
              setCurrent({ y: d.getFullYear(), m: d.getMonth() });
              setSelected(d);
            }}
            className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-2 px-4 pt-4 text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
        {weekdays.map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2 p-4">
        {weeks.flat().map((d, idx) => {
          const inMonth = d.getMonth() === current.m;
          const isToday = isSameDay(d, now);
          const isSel = isSameDay(d, selected);

          const cellKey = keyFromPartsSofia(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
          );
          const count = apptCountByDay.get(cellKey) || 0;
          const hasAppt = count > 0;

          // Time off for this cell
          const matchingTimeOff = timeOff.filter(
            (t) => t.dateFrom <= cellKey && t.dateTo >= cellKey
          );
          const isTimeOff = matchingTimeOff.length > 0;
          const isFullDayOff = matchingTimeOff.some((t) => !t.from && !t.to);

          const baseClasses = [
            "relative h-20 rounded-xl border text-left p-3 transition-colors",
            inMonth
              ? "bg-white dark:bg-[#0F1117] border-[#E5E7EB] dark:border-[#1F2937]"
              : "bg-white/60 dark:bg-[#0F1117]/60 border-dashed border-[#E5E7EB] dark:border-[#1F2937] opacity-70",
            isToday
              ? "border-transparent [background:linear-gradient(#fff,#fff),conic-gradient(from_180deg,#2F80ED33,#06B6D433,#7C3AED33,#2F80ED33)] [background-origin:border-box] [background-clip:padding-box,border-box] dark:[background:linear-gradient(#0F1117,#0F1117),conic-gradient(from_180deg,#2F80ED33,#06B6D433,#7C3AED33,#2F80ED33)]"
              : "",
            isSel ? "bg-[#2F80ED]/10 border-[#2F80ED]/40" : "",
            isFullDayOff
              ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/60 text-red-700 dark:text-red-200"
              : "",
          ].join(" ");

          const Inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{d.getDate()}</span>

                <div className="flex flex-col items-end gap-1">
                  {/* Full-day time off pill */}
                  {isFullDayOff && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-100 px-2 py-0.5 text-[10px] font-semibold">
                      Time off
                    </span>
                  )}

                  {/* Appointment count badge (only if not full-day off) */}
                  {!isFullDayOff && hasAppt && (
                    <span
                      title={`${count} appointment${
                        count > 1 ? "s" : ""
                      }`}
                      className="inline-flex items-center gap-1 rounded-md bg-[#2F80ED]/10 text-[#2F80ED] px-2 py-0.5 text-[10px] font-semibold"
                    >
                      ● {count}
                    </span>
                  )}

                  {isToday && (
                    <span className="rounded-md bg-[#2F80ED]/10 text-[#2F80ED] px-2 py-0.5 text-[10px] font-semibold">
                      Today
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom lines */}
              {hasAppt && !isFullDayOff && (
                <span className="pointer-events-none absolute left-3 right-3 bottom-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
              )}

              {isTimeOff && (
                <span className="pointer-events-none absolute left-3 right-3 bottom-1 h-[2px] rounded-full bg-red-500/80" />
              )}
            </>
          );

          // If this day has any time off, use Link to navigate to details
          if (isTimeOff) {
            return (
              <Link
                key={idx}
                to={`/timeoff/${cellKey}`}
                className={baseClasses}
                onClick={() => setSelected(new Date(d))}
              >
                {Inner}
              </Link>
            );
          }

          // Otherwise, plain button (no navigation)
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelected(new Date(d))}
              className={baseClasses}
            >
              {Inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
