/* UI-only, palette-matched (no functionality) */
import { Calendar as CalendarIcon, ListFilter, Loader2, Clock, MapPin, Phone, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ItemCatalog from "./item/ItemCatalog";
import { getDateAndTime, prettyDate } from "../../utils/dates";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useAppointments } from "../../api/appointmentApi";

const MotionSection = motion.section

export default function Catalog() {
  const timestamp = new Date()

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1)

  const { appointments } = useAppointments()

  let allAppointments = appointments.appointments || [];

  allAppointments = allAppointments.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt))  

  const totalPages = Math.max(1, Math.ceil(allAppointments.length / pageSize))

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev || 1, totalPages))
  }, [totalPages])

  const offset = (currentPage - 1) * pageSize;

  const paginatedAppointments = allAppointments.slice(
    offset,
    offset + pageSize
  )

  const upcoming = allAppointments.filter(x => {
    const appt = new Date(x?.startsAt)
    return appt > timestamp
  })
  
  const nextAppt1 = upcoming[upcoming.length - 1]
  const pDate = prettyDate(String(nextAppt1?.startsAt))
  

  const { _day, _date, time } = getDateAndTime(String(new Date(nextAppt1?.startsAt)))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#334155] dark:text-[#94A3B8]" />
            <h1 className="text-xl font-semibold text-[#334155] dark:text-[#94A3B8]">
              All Appointments
            </h1>
          </div>

          {/* Filter bar (static/disabled) */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
              <select
                disabled
                className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
                defaultValue=""
              >
                <option value="">All statuses</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <input
                disabled
                placeholder="Filter by clientId"
                className="w-56 rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] placeholder-slate-400 opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              />
            </div>

            <select
              disabled
              className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              defaultValue="startsAt:asc"
            >
              <option value="startsAt:asc">Start time ↑</option>
              <option value="startsAt:desc">Start time ↓</option>
              <option value="createdAt:desc">Newest created</option>
              <option value="createdAt:asc">Oldest created</option>
            </select>

            <select
              disabled
              className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              defaultValue={5}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        {/* Content container */}
        <div className="space-y-4">
          {/* Next appointment highlight */}
          {nextAppt1 ? (
            <MotionSection initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.3}} className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
              <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F80ED]/10 text-[#2F80ED]"><Clock className="h-5 w-5"/></div>
                  <div>
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">Next appointment</div>
                    <div className="text-xl text-cyan-50 font-semibold">{pDate} - {time}</div>
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{nextAppt1.service} · with {nextAppt1.firstName} {nextAppt1.lastName}</div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]"><MapPin className="h-4 w-4"/>Law Office · 12 Vitosha Blvd</div>
                      <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]">
                        {/* Call button */}
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
                      <StatusPill status={nextAppt1.status} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={`/appointments/${nextAppt1._id}/upDate`} className="inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors">Reschedule</Link>
                  <Link className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] text-cyan-50 px-4 py-2.5 hover:bg-[#000000] dark:hover:bg-[#ffffff] hover:text-black">Cancel</Link>
                </div>
              </div>
              <div className="mx-5 mb-5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            </MotionSection>
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200/40 bg-slate-100/40 p-12 text-sm text-[#334155] dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-[#94A3B8]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading appointments…
            </div>
          )}
          {/* Loading (example) */}
         
          {allAppointments.length > 0 ? (
            <ItemCatalog appointments={paginatedAppointments}/>
          ) : (
            <h3 className="text-center text-lg font-medium mt-2 text-[#334155] dark:text-[#94A3B8]">
            No appointments yet
          </h3>
          )}

          {/* Pagination (static/disabled) */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] dark:border-slate-800/60 dark:text-[#94A3B8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-sm text-[#334155] dark:text-[#94A3B8]">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] dark:border-slate-800/60 dark:text-[#94A3B8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
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