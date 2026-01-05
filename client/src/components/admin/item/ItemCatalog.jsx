import { Link } from "react-router";
import { formatSofiaDate, formatSofiaTime } from "../../../utils/dates";
import { CalendarIcon } from "lucide-react";

function StatusBadge({ status = "Confirmed" }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const map = {
    PENDING:
      "bg-amber-200/20 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    CONFIRMED:
      "bg-emerald-200/20 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    CANCELLED:
      "bg-rose-200/20 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    COMPLETED:
      "bg-slate-300/20 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200",
  };
  return (
    <span className={`${base} ${map[status] || map.COMPLETED}`}>{status}</span>
  );
}

export default function ItemCatalog({ appointments }) {
  return (
    <ul className="divide-y divide-slate-200/40 overflow-hidden rounded-2xl border border-slate-200/40 bg-slate-100/40 dark:divide-slate-800/60 dark:border-slate-800/60 dark:bg-slate-900/40">
      {/* Row 1 */}
      {appointments.map((a) => (
        <li
          key={a._id}
          className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937]
                     bg-white dark:bg-[#111827] shadow-sm"
        >
          {/* SAME background design (the “card glow” look) */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2F80ED]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        
          <div className="relative p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                               bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20 shrink-0"
                  >
                    <CalendarIcon className="h-5 w-5" />
                  </span>
        
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight text-[#0B1220] dark:text-white truncate">
                      {`${a.notes || "Appointment"} · ${a.mode}`}
                    </p>
        
                    <p className="mt-0.5 text-xs text-[#334155]/70 dark:text-[#94A3B8]/70">
                      {`${formatSofiaDate(a.startsAt)}, ${formatSofiaTime(a.startsAt)}`} (Europe/Sofia)
                    </p>
        
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={a.status} />
        
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]
                                       bg-white/60 dark:bg-[#0F1117]/50
                                       border border-[#E5E7EB] dark:border-[#1F2937]
                                       text-[#334155]/70 dark:text-[#94A3B8]/70">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2F80ED]/70" />
                        Created: {`${formatSofiaDate(a.createdAt)}, ${formatSofiaTime(a.createdAt)}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
        
              <div className="flex items-center gap-2 justify-end shrink-0">
                <Link
                  to={`/appointments/${a._id}/details`}
                  className="inline-flex items-center justify-center rounded-xl
                             border border-[#E5E7EB] dark:border-[#1F2937]
                             bg-white/60 dark:bg-[#0F1117]/50
                             px-3 py-2 text-xs font-semibold
                             text-[#334155] dark:text-[#94A3B8]
                             hover:bg-[#F5F7FA] dark:hover:bg-[#020617] transition-colors"
                >
                  View
                </Link>
        
                <Link
                  to={`/appointments/${a._id}/update`}
                  className="inline-flex items-center justify-center rounded-xl
                             bg-[#0B1220] dark:bg-white
                             px-3 py-2 text-xs font-semibold
                             text-white dark:text-[#0B1220]
                             hover:opacity-90 transition"
                >
                  Edit
                </Link>
              </div>
            </div>
        
            {/* Optional: subtle divider like your other cards */}
            <div className="mt-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/30 to-transparent" />
          </div>
        </li>
      ))}
    </ul>
  );
}
