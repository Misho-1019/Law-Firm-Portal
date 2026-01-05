import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  FileText,
  Upload,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X
} from "lucide-react";
import { Link } from "react-router";
import { getDateAndTime, prettyDate } from "../../utils/dates";
import ItemDashboard from "./item/ItemDashboard";
import { useMyAppointments } from "../../api/appointmentApi";

const MotionSection = motion.section;
const MotionAside = motion.aside;

/* ----------------------------------------------------------
   Client Home (authenticated client portal)
---------------------------------------------------------- */
export default function ClientDashboard(){
  const timestamp = new Date()
  const { myAppointments, isLoading } = useMyAppointments()

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1)

  const allAppointments = myAppointments.appointments || []

  const totalPages = Math.max(
    1,
    Math.ceil(allAppointments.length / pageSize)
  )

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev || 1, totalPages))
  }, [totalPages])

  const offset = (currentPage - 1) * pageSize;

  const paginatedAppointments = allAppointments.slice(
    offset,
    offset + pageSize
  )

  const upcomingAppt = allAppointments.filter((x) => {
    const appt = new Date(x?.startsAt)
    return appt > timestamp;
  })
    
  const nextAppt1 = upcomingAppt[0] || [];

  const pDate = prettyDate(String(nextAppt1.startsAt))
  
  const {_day, _date, time} = getDateAndTime(String(new Date(nextAppt1.startsAt)));

  const updates = [
    { id:'u1', kind:'info', text:'Please bring your contract draft (PDF).' },
    { id:'u2', kind:'info', text:'Parking entrance is on Shipka St.' },
  ];

  const documents = [
    { id:'d1', name:'NDA_draft.pdf', size:'124 KB' },
    { id:'d2', name:'Client_Onboarding.pdf', size:'88 KB' },
  ];

  return (
    <div className='dark'>
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        
        {/* Content */}
        <main className="mx-auto max-w-7xl px-5 py-8 grid gap-6 lg:grid-cols-3">
          {/* Next appointment highlight */}
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden lg:col-span-3 rounded-2xl bg-white dark:bg-[#111827]
                       border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            {/* Soft glow background (same style) */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2F80ED]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          
            {/* Content */}
            <div className="relative">
              {isLoading ? (
                <div className="p-6 md:p-7">
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 w-40 rounded bg-white/10" />
                    <div className="h-7 w-72 rounded bg-white/10" />
                    <div className="h-4 w-56 rounded bg-white/10" />
                  </div>
                </div>
              ) : upcomingAppt.length > 0 ? (
                <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20">
                      <Clock className="h-5 w-5" />
                    </div>
          
                    <div>
                      <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                        Next appointment
                      </div>
                      <div className="text-xl font-semibold">
                        {pDate} - {time}
                      </div>
                      <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                        {nextAppt1.service} · with Victor Todorov
                      </div>
          
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]">
                          <MapPin className="h-4 w-4" />
                          Law Office · 12 Vitosha Blvd
                        </div>
          
                        <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]">
                          <Phone className="h-4 w-4" />
                          <a href="tel:+359889116617">+359 88 911 6617</a>
                        </div>
          
                        <StatusPill status={nextAppt1.status} />
                      </div>
                    </div>
                  </div>
          
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/appointments/${nextAppt1._id}/update`}
                      className="inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors"
                    >
                      Reschedule
                    </Link>
                    <Link
                      className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-7 flex items-center justify-center">
                  <div className="w-full max-w-xl text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20">
                      <Clock className="h-7 w-7" />
                    </div>
          
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#0B1220] dark:text-white">
                        No upcoming appointment
                      </h3>
          
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20">
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
                        className="inline-flex items-center justify-center rounded-2xl bg-[#2F80ED] text-white px-5 py-2.5 font-semibold shadow-sm hover:opacity-95 transition"
                      >
                        Book an appointment
                      </Link>
          
                      <Link
                        to="/schedule"
                        className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-5 py-2.5 text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] transition"
                      >
                        View schedule
                      </Link>
                    </div>
          
                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] px-3 py-2 text-xs text-[#334155] dark:text-[#94A3B8]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#2F80ED]/10 text-[#2F80ED]">
                        <CalendarIcon className="h-4 w-4" />
                      </span>
                      <span>Tip: booking ahead helps you get your preferred slot.</span>
                    </div>
                  </div>
                </div>
              )}
          
              <div className="mx-5 mb-5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            </div>
          </MotionSection>

          {/* Appointments list (left 2 cols) */}
          <MotionSection
            id="appointments"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden lg:col-span-2 rounded-2xl bg-white dark:bg-[#111827]
                       border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            {/* Soft glow background (same style) */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2F80ED]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          
            {/* Content */}
            <div className="relative">
              <div className="p-4 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">My appointments</h2>
                  <p className="text-sm text-[#334155] dark:text-[#94A3B8]">Upcoming</p>
                </div>
          
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5
                             border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors"
                >
                  Book new
                </Link>
              </div>
          
              <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
          
              <ul className="p-4 space-y-3">
                {allAppointments.length === 0 ? (
                  <li className="rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937]
                                 bg-white/40 dark:bg-[#0F1117]/40 p-3 text-sm text-[#334155]
                                 dark:text-[#94A3B8] flex items-center justify-between">
                    <span>No appointments yet.</span>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                ) : (
                  paginatedAppointments.map((appointment) => (
                    <ItemDashboard key={appointment._id} {...appointment} />
                  ))
                )}
              </ul>
          
              {/* Pagination */}
              <div className="mt-4 flex items-center justify-center gap-2 pb-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] opacity-50
                             dark:border-slate-800/60 dark:text-[#94A3B8]"
                >
                  Prev
                </button>
          
                <span className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Page {currentPage} / {totalPages}
                </span>
          
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] opacity-50
                             dark:border-slate-800/60 dark:text-[#94A3B8]"
                >
                  Next
                </button>
              </div>
            </div>
          </MotionSection>

          {/* Sidebar: Updates & Documents */}
          <MotionAside
            id="updates"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#111827]
                       border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            {/* Soft glow background (same style) */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#2F80ED]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          
            {/* Content */}
            <div className="relative">
              <div className="p-4 pb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Updates</h3>
              </div>
          
              <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
          
              <ul className="p-4 space-y-3 text-sm">
                {updates.map((u) => (
                  <li key={u.id} className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-[#0369A1] mt-0.5" />
                    <div className="text-[#334155] dark:text-[#94A3B8]">{u.text}</div>
                  </li>
                ))}
              </ul>
            </div>
          </MotionAside>

          <MotionAside
            id="documents"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#111827]
                       border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            {/* Soft glow background (same style) */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#2F80ED]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          
            {/* Content */}
            <div className="relative">
              <div className="p-4 pb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Documents</h3>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] text-sm">
                  <Upload className="h-4 w-4" /> Upload
                </button>
              </div>
          
              <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
          
              <ul className="p-4 space-y-2 text-sm">
                {documents.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between rounded-xl border border-[#E5E7EB] dark:border-[#1F2937]
                               bg-white/40 dark:bg-[#0F1117]/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                      <span className="font-medium">{d.name}</span>
                    </div>
                    <span className="text-[#334155] dark:text-[#94A3B8]">{d.size}</span>
                  </li>
                ))}
              </ul>
            </div>
          </MotionAside>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © {new Date().getFullYear()} LexSchedule. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Status pill (semantic, accessible)
---------------------------------------------------------- */
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