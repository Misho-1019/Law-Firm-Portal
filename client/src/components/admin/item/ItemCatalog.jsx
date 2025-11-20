import { Link } from "react-router";
import { formatSofiaDate, formatSofiaTime } from "../../../utils/dates";

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
        <li className="p-4" key={a._id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#334155] dark:text-[#94A3B8]">
                {`${a.notes} · ${a.mode}`}
              </p>
              <p className="mt-0.5 text-xs text-[#334155]/70 dark:text-[#94A3B8]/70">
                {`${formatSofiaDate(a.startsAt)}, ${formatSofiaTime(a.startsAt)}`} (Europe/Sofia)
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StatusBadge status={a.status} />
                <span className="text-xs text-[#334155]/70 dark:text-[#94A3B8]/70">
                  Created: {`${formatSofiaDate(a.createdAt)}, ${formatSofiaTime(a.createdAt)}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/appointments/${a._id}/details`}
                className="rounded-xl border border-slate-200/40 px-3 py-2 text-xs font-medium text-[#334155] hover:bg-slate-200/30 dark:border-slate-800/60 dark:text-[#94A3B8] dark:hover:bg-slate-800/50"
              >
                View
              </Link>
              <Link
                to={`/appointments/${a._id}/update`}
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Edit
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
