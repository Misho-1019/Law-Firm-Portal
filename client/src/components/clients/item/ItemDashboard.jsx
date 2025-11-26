import { Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { getDateAndTime } from "../../../utils/dates";
import { Link } from "react-router";
export default function ItemDashboard({
    _id,
    startsAt,
    status,
    service,
    mode,
    open
}) {
  const {day, date, time } = getDateAndTime(String(new Date(startsAt)));

  return (
    <div>
      <li
        key={_id}
        className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
            <span className="font-semibold">
              {day}, {date} · {time}
            </span>
          </div>
          <StatusPill status={status} />
        </div>
        <div className="mt-2 text-sm flex items-center justify-between">
          <div>
            <div className="font-medium">{service}</div>
            <div className="text-[#334155] dark:text-[#94A3B8]">
              {mode === 'In-Person' ? 'Office · 12 Vitosha Blvd' : 'Video Call'}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={open}
              className="rounded-xl border border-[#2F80ED] text-[#2F80ED] px-3 py-1.5 hover:bg-[#2F80ED] hover:text-white transition-colors"
            >
              Reschedule
            </button>
            <Link to={`/appointments/${_id}/details`} className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] hover:text-black">
              Details
            </Link>
          </div>
        </div>
      </li>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    CONFIRMED: { bg: 'bg-[rgba(22,101,52,0.12)]', fg: 'text-[#166534]', label: 'Confirmed', Icon: CheckCircle2 },
    PENDING:   { bg: 'bg-[rgba(180,83,9,0.12)]',  fg: 'text-[#B45309]', label: 'Pending',   Icon: AlertCircle },
    CANCELLED:  { bg: 'bg-[rgba(185,28,28,0.12)]', fg: 'text-[#B91C1C]', label: 'Canceled',  Icon: XCircle },
    INFO:      { bg: 'bg-[rgba(3,105,161,0.12)]',  fg: 'text-[#0369A1]', label: 'Info',      Icon: AlertCircle },
  };
  const S = map[status] || map.INFO;
  const I = S.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${S.bg} ${S.fg}`}>
      <I className="h-3.5 w-3.5" /> {S.label}
    </span>
  );
}
