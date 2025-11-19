import { motion } from "framer-motion";
import { Link } from "react-router";
import { Clock, ChevronRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const MotionAside = motion.aside;

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
    upcoming
}) {
  return (
    <MotionAside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
    >
      <div className="p-4 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Upcoming</h3>
          <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
            Next appointments
          </p>
        </div>
        <Link
          to="/appointments"
          className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5 border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

      <ul className="p-4 space-y-3">
        {upcoming.map((a) => (
          <li
            key={a._id}
            className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                <span className="font-semibold">{`${new Date(
                  a.startsAt
                ).getHours()}:${new Date(a.startsAt).getMinutes()} PM`}</span>
              </div>
              <StatusPill status={a.status} />
            </div>
            <div className="mt-2 text-sm">
              <div className="font-medium">{`${a.firstName} ${a.lastName}`}</div>
              <div className="text-[#334155] dark:text-[#94A3B8]">
                {a.notes}
              </div>
            </div>
          </li>
        ))}
        <li className="rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] p-3 text-sm text-[#334155] dark:text-[#94A3B8] flex items-center justify-between">
          <span>No more items.</span>
          <ChevronRight className="h-4 w-4" />
        </li>
      </ul>
    </MotionAside>
  );
}
