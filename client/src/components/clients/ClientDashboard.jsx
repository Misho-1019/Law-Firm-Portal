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
import appointmentsService from "../../services/appointmentsService";
import { getDateAndTime, prettyDate } from "../../utils/dates";
import ItemDashboard from "./item/ItemDashboard";

const MotionSection = motion.section;
const MotionAside = motion.aside;

/* ----------------------------------------------------------
   Client Home (authenticated client portal)
---------------------------------------------------------- */
export default function ClientDashboard(){
  const timestamp = new Date()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    appointmentsService.getMine()
      .then(setAppointments)
      .finally(setIsLoading(false))
  }, [])

  const allAppointments = appointments[0] || []

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

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-[#334155] dark:text-[#94A3B8]">
        Loading appointments…
      </div>
    );
  }

  return (
    <div className='dark'>
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        
        {/* Content */}
        <main className="mx-auto max-w-7xl px-5 py-8 grid gap-6 lg:grid-cols-3">
          {/* Next appointment highlight */}
          <MotionSection initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.3}} className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F80ED]/10 text-[#2F80ED]"><Clock className="h-5 w-5"/></div>
                <div>
                  <div className="text-sm text-[#334155] dark:text-[#94A3B8]">Next appointment</div>
                  <div className="text-xl font-semibold">{pDate} - {time}</div>
                  <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{nextAppt1.service} · with Victor Todorov</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]"><MapPin className="h-4 w-4"/>Law Office · 12 Vitosha Blvd</div>
                    <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]"><Phone className="h-4 w-4"/>+359 8 911 6617</div>
                    <StatusPill status={nextAppt1.status} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/appointments/${nextAppt1._id}/update`} className="inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors">Reschedule</Link>
                <Link className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Cancel</Link>
              </div>
            </div>
            <div className="mx-5 mb-5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
          </MotionSection>

          {/* Appointments list (left 2 cols) */}
          <MotionSection id="appointments" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35}} className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">My appointments</h2>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">Upcoming</p>
              </div>
              <Link to='/create' className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5 border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors">Book new</Link>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

            <ul className="p-4 space-y-3">
              {paginatedAppointments.map(appointment => <ItemDashboard key={appointment._id} {...appointment}/> )}
              <li className="rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] p-3 text-sm text-[#334155] dark:text-[#94A3B8] flex items-center justify-between">
                <span>No more items.</span>
                <ChevronRight className="h-4 w-4"/>
              </li>
            </ul>

            {/* Pagination (static/disabled) */}
            <div className="mt-4 flex items-center justify-center gap-2 ">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] opacity-50 dark:border-slate-800/60 dark:text-[#94A3B8]"
              >
                Prev
              </button>
              <span className="text-sm text-[#334155] dark:text-[#94A3B8]">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] opacity-50 dark:border-slate-800/60 dark:text-[#94A3B8]"
              >
                Next
              </button>
            </div>
          </MotionSection>

          {/* Sidebar: Updates & Documents */}
          <MotionAside id="updates" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35, delay:.05}} className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="p-4 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Updates</h3>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            <ul className="p-4 space-y-3 text-sm">
              {updates.map(u => (
                <li key={u.id} className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 text-[#0369A1] mt-0.5"/>
                  <div>{u.text}</div>
                </li>
              ))}
            </ul>
          </MotionAside>

          <MotionAside id="documents" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.4, delay:.1}} className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="p-4 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documents</h3>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] hover:text-black text-sm">
                <Upload className="h-4 w-4"/> Upload
              </button>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            <ul className="p-4 space-y-2 text-sm">
              {documents.map(d => (
                <li key={d.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]"/>
                    <span className="font-medium">{d.name}</span>
                  </div>
                  <span className="text-[#334155] dark:text-[#94A3B8]">{d.size}</span>
                </li>
              ))}
            </ul>
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