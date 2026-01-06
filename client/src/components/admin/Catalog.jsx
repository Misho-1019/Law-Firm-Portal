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

  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  const [defaultStatus, setDefaultStatus] = useState('ALL')

  const [sortKey, setSortKey] = useState('startsAt:asc')

  const { appointments, isLoading } = useAppointments()

  let allAppointments = appointments.appointments || [];

  const filteredAppointments = allAppointments.filter(x => defaultStatus === 'ALL' || x.status === defaultStatus)

  const sortedAppointments = filteredAppointments.slice().sort((a, b) => {
    switch (sortKey) {
      case 'startsAt:asc':
        return new Date(a.startsAt) - new Date(b.startsAt)
      case 'startsAt:desc':
        return new Date(b.startsAt) - new Date(a.startsAt)
      case "createdAt:desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "createdAt:asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  })

  const totalPages = Math.max(1, Math.ceil(sortedAppointments.length / pageSize))

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev || 1, totalPages))
  }, [totalPages])

  const offset = (currentPage - 1) * pageSize;

  const paginatedAppointments = sortedAppointments.slice(
    offset,
    offset + pageSize
  )
  
  const nextAppt1 = (appointments.appointments || [])
    .filter(a => a.status !== "CANCELLED")
    .filter(a => new Date(a.startsAt) > timestamp)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))[0];

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
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value)}
                className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              >
                <option value="ALL">All statuses</option>
                <option value='PENDING'>Pending</option>
                <option value='CONFIRMED'>Confirmed</option>
                <option value='CANCELLED'>Cancelled</option>
              </select>

              {/* <input
                placeholder="Filter by clientId"
                className="w-56 rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] placeholder-slate-400 opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              /> */}
            </div>

            <select
              value={sortKey}
              onChange={(e) => {
                setSortKey(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
            >
              <option value="startsAt:asc">Start time ↑</option>
              <option value="startsAt:desc">Start time ↓</option>
              <option value="createdAt:desc">Newest created</option>
              <option value="createdAt:asc">Oldest created</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {/* Content container */}
        <div className="space-y-4">
          {/* Next appointment highlight */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200/40 bg-slate-100/40 p-12 text-sm text-[#334155] dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-[#94A3B8]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading appointments…
            </div>
          ) : nextAppt1 ? (
            <MotionSection
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden lg:col-span-3 rounded-2xl bg-white dark:bg-[#111827]
                         border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
            >
              {/* Soft glow background */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2F80ED]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          
              <div className="relative p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                                  bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
          
                  <div className="min-w-0">
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                      Next appointment
                    </div>
          
                    <div className="text-xl font-semibold tracking-tight text-[#0B1220] dark:text-white">
                      {pDate} — {time}
                    </div>
          
                    <div className="mt-0.5 text-sm text-[#334155] dark:text-[#94A3B8] truncate">
                      {nextAppt1.service} · with {nextAppt1.firstName} {nextAppt1.lastName}
                    </div>
          
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            "Vasil Levski Blvd, Sofia Center, Bulgaria"
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            text-sm font-semibold text-[#0B1220] dark:text-white
                            hover:text-[#2F80ED] dark:hover:text-[#60A5FA]
                            focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/20 rounded-lg px-1 -mx-1
                            transition-colors
                          "
                          title="Open directions in Google Maps"
                        >
                          Vasil Levski Blvd, Sofia Center, Bulgaria
                        </a>
                      </div>
          
                      {/* Call CTA */}
                      <a
                        href="tel:+359889116617"
                        className="inline-flex items-center gap-2 rounded-2xl
                                   border border-[#E5E7EB] dark:border-[#1F2937]
                                   bg-white/60 dark:bg-[#0F1117]/50
                                   px-4 py-2 text-sm font-semibold
                                   text-[#2F80ED] dark:text-[#60A5FA]
                                   hover:bg-[#F5F7FA] dark:hover:bg-[#020617]
                                   transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Call us: +359 889 116 617
                      </a>
          
                      <StatusPill status={nextAppt1.status} />
                    </div>
                  </div>
                </div>
          
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Link
                    to={`/appointments/${nextAppt1._id}/update`}
                    className="inline-flex items-center justify-center rounded-2xl
                               border border-[#2F80ED] text-[#2F80ED]
                               px-4 py-2.5 font-semibold
                               hover:bg-[#2F80ED] hover:text-white transition-colors"
                  >
                    Reschedule
                  </Link>
          
                  <Link
                    to={`/appointments/${nextAppt1._id}/cancel`}
                    className="inline-flex items-center justify-center rounded-2xl
                               border border-[#E5E7EB] dark:border-[#1F2937]
                               bg-white/60 dark:bg-[#0F1117]/50
                               px-4 py-2.5 font-semibold
                               text-[#334155] dark:text-[#94A3B8]
                               hover:bg-[#F5F7FA] dark:hover:bg-[#020617]
                               transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
          
              <div className="mx-5 mb-5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            </MotionSection>
          ) : (
            <MotionSection
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden lg:col-span-3 rounded-2xl bg-white dark:bg-[#111827]
                         border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
            >
              {/* Soft glow background */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2F80ED]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          
              <div className="relative p-6 md:p-7 flex items-center justify-center">
                <div className="w-full max-w-xl text-center">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl
                                  bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20">
                    <Clock className="h-7 w-7" />
                  </div>
          
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#0B1220] dark:text-white">
                      No upcoming appointment
                    </h3>
          
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
                                     bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                      Available
                    </span>
                  </div>
          
                  <p className="mt-2 text-sm md:text-base leading-relaxed text-[#334155] dark:text-[#94A3B8]">
                    You’re all set for now. Book a time that works for you and we’ll confirm it shortly.
                  </p>
          
                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to="/create"
                      className="inline-flex items-center justify-center rounded-2xl bg-[#2F80ED] text-white
                                 px-5 py-2.5 font-semibold shadow-sm hover:opacity-95 transition"
                    >
                      Book an appointment
                    </Link>
          
                    <Link
                      to="/schedule"
                      className="inline-flex items-center justify-center rounded-2xl
                                 border border-[#E5E7EB] dark:border-[#1F2937]
                                 bg-white/60 dark:bg-[#0F1117]/50
                                 px-5 py-2.5 text-[#334155] dark:text-[#94A3B8]
                                 hover:bg-[#F5F7FA] dark:hover:bg-[#020617] transition"
                    >
                      View schedule
                    </Link>
                  </div>
                </div>
              </div>
          
              <div className="mx-5 mb-5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            </MotionSection>
          )}
          {/* Loading (example) */}
         
          {sortedAppointments.length > 0 ? (
            <ItemCatalog appointments={paginatedAppointments}/>
          ) : (
            <div className="py-6 text-center">
              <div className="inline-flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#0B1220] dark:text-white">
                  No appointments yet
                </h3>
                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold
                                 bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20">
                  New
                </span>
              </div>
            
              <div className="mx-auto mt-2 h-[2px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            
              <p className="mt-2 text-sm text-[#334155] dark:text-[#94A3B8]">
                Once you book, your upcoming appointments will show here.
              </p>
            </div>

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