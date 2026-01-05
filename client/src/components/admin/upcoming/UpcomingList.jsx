import {
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { getDateAndTime } from "../../../utils/dates";
import { Link } from "react-router";

/* --- Status pill (UI only) --- */
function StatusPill({ status }) {
  const map = {
    CONFIRMED: {
      bg: "bg-[rgba(22,101,52,0.12)]",
      fg: "text-[#166534]",
      label: "Confirmed",
      Icon: CheckCircle2,
    },
    PENDING: {
      bg: "bg-[rgba(180,83,9,0.12)]",
      fg: "text-[#B45309]",
      label: "Pending",
      Icon: AlertCircle,
    },
    CANCELLED: {
      bg: "bg-[rgba(185,28,28,0.12)]",
      fg: "text-[#B91C1C]",
      label: "Cancelled",
      Icon: XCircle,
    },
    INFO: {
      bg: "bg-[rgba(3,105,161,0.12)]",
      fg: "text-[#0369A1]",
      label: "Info",
      Icon: AlertCircle,
    },
  };
  const S = map[status] || map.info;
  const I = S.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${S.bg} ${S.fg}`}
    >
      <I className="h-3.5 w-3.5" /> {S.label}
    </span>
  );
}

export default function UpcomingList({
  _id,
  startsAt,
  status,
  firstName,
  lastName,
  notes,
}) {
  const { day, date, time } = getDateAndTime(String(new Date(startsAt)));

  return (
    <li
      key={_id}
      className="relative overflow-hidden rounded-xl border border-[#E5E7EB] dark:border-[#1F2937]
                 bg-white/60 dark:bg-[#0F1117]/50 p-3 shadow-sm"
    >
      {/* Soft glow background (subtle, same family) */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#2F80ED]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-400/8 blur-3xl" />
    
      <div className="relative space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20 shrink-0">
              <Clock className="h-4 w-4" />
            </span>
    
            <span className="font-semibold truncate">
              {`${day}, ${date} — ${time}`}
            </span>
          </div>
    
          <div className="shrink-0">
            <StatusPill status={status} />
          </div>
        </div>
    
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#0B1220] dark:text-white truncate">
              {`${firstName} ${lastName}`}
            </div>
            {notes ? (
              <div className="mt-0.5 text-sm text-[#334155] dark:text-[#94A3B8] line-clamp-2">
                {notes}
              </div>
            ) : (
              <div className="mt-0.5 text-xs text-[#64748B] dark:text-[#9CA3AF]">
                No notes provided.
              </div>
            )}
          </div>
    
          <div className="flex items-center gap-2 justify-end shrink-0">
            <Link
              to={`/appointments/${_id}/details`}
              className="inline-flex items-center justify-center rounded-xl
                         border border-[#E5E7EB] dark:border-[#1F2937]
                         bg-white/60 dark:bg-[#0F1117]/50 px-3 py-2 text-xs font-semibold
                         text-[#334155] dark:text-[#94A3B8]
                         hover:bg-[#F5F7FA] dark:hover:bg-[#020617] transition-colors"
            >
              View
            </Link>
    
            <Link
              to={`/appointments/${_id}/update`}
              className="inline-flex items-center justify-center rounded-xl
                         bg-[#0B1220] dark:bg-white px-3 py-2 text-xs font-semibold
                         text-white dark:text-[#0B1220]
                         hover:opacity-90 transition"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
