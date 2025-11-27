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
      className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3"
    >
      <div className="flex items-center justify-between gap-20">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
          <span className="font-semibold">{`${day}, ${date} - ${time}`}</span>
        </div>
        <StatusPill status={status} />
      </div>
      <div className="flex items-center justify-between gap-20">
        <div className="mt-2 text-sm gap-2">
          <div className="font-medium">{`${firstName} ${lastName}`}</div>
          <div className="text-[#334155] dark:text-[#94A3B8]">{notes}</div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/appointments/${_id}/details`}
            className="rounded-xl border border-slate-200/40 px-3 py-2 text-xs font-medium text-[#334155] hover:bg-slate-200/30 dark:border-slate-800/60 dark:text-[#94A3B8] dark:hover:bg-slate-800/50"
          >
            View
          </Link>
          <Link
            to={`/appointments/${_id}/update`}
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Edit
          </Link>
        </div>
      </div>
    </li>
  );
}
