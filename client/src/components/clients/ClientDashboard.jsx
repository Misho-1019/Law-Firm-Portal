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
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X
} from "lucide-react";
import { Link } from "react-router";
import appointmentsService from "../../services/appointmentsService";
import { getDateAndTime } from "../../utils/dates";
import ItemDashboard from "./item/ItemDashboard";

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionAside = motion.aside;

/* ----------------------------------------------------------
   Client Home (authenticated client portal)
---------------------------------------------------------- */
export default function ClientDashboard(){
  const timestamp = new Date()
  const [openBook, setOpenBook] = useState(false);
  const [openResched, setOpenResched] = useState(false);
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    appointmentsService.getMine()
      .then(setAppointments)
      .finally(setIsLoading(false))
  }, [])

  console.log(appointments);

  const allAppointments = appointments[0] || []

  const upcomingAppt = allAppointments.filter((x) => {
    const appt = new Date(x?.startsAt)
    return appt > timestamp;
  })
    
  const nextAppt1 = upcomingAppt[0] || [];
  
  const {day, date, time} = getDateAndTime(String(new Date(nextAppt1.startsAt)));

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
                  <div className="text-xl font-semibold">{day}, {date} - {time}</div>
                  <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{nextAppt1.service} · with Victor Todorov</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]"><MapPin className="h-4 w-4"/>Law Office · 12 Vitosha Blvd</div>
                    <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]"><Phone className="h-4 w-4"/>+359 8 911 6617</div>
                    <StatusPill status={nextAppt1.status} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={()=>setOpenResched(true)} className="inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors">Reschedule</button>
                <button className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Cancel</button>
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
              <button onClick={()=>setOpenBook(true)} className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5 border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors">Book new</button>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

            <ul className="p-4 space-y-3">
              {upcomingAppt.map(appointment => <ItemDashboard key={appointment._id} {...appointment} open={() => setOpenResched(true)}/>)}
              <li className="rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] p-3 text-sm text-[#334155] dark:text-[#94A3B8] flex items-center justify-between">
                <span>No more items.</span>
                <ChevronRight className="h-4 w-4"/>
              </li>
            </ul>
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

      {/* Modals */}
      <QuickBookModal open={openBook} onClose={()=>setOpenBook(false)} />
        <RescheduleModal open={openResched} onClose={() => setOpenResched(false)} appt={{ title: nextAppt1.service }}/>
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

/* ----------------------------------------------------------
   Quick book & reschedule modals (UI only)
---------------------------------------------------------- */
function Field({ id, label, placeholder = "", type = "text", as }) {
  const InputTag = as === 'textarea' ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] focus-within:ring-4 focus-within:ring-[#2F80ED]/35">
        <div className="flex items-center gap-2 px-3 py-2">
          <InputTag id={id} placeholder={placeholder} type={as==='textarea'?undefined:type} className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8] min-h-[42px]" />
        </div>
      </div>
    </div>
  );
}

function ModalShell({ title, children, onClose }) {
  const stop = (e) => e.stopPropagation();
  return (
    <MotionDiv className="fixed inset-0 z-50" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="absolute inset-0 bg-black/40" />
      <MotionSection
        role="dialog"
        aria-modal
        onClick={stop}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative mx-auto mt-20 w-[92%] max-w-lg rounded-2xl bg-[#111827] text-white border border-[#1F2937] shadow-xl"
      >
        <div className="flex items-center justify-between p-4 pb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-[#0E1726]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
        <div className="p-4">{children}</div>
      </MotionSection>
    </MotionDiv>
  );
}

function QuickBookModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <ModalShell title="Book a new appointment" onClose={onClose}>
          <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
            <Field id="topic" label="Topic" placeholder="e.g., Contract review" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field id="date" type="date" label="Date" />
              <Field id="time" type="time" label="Time" />
            </div>
            <Field id="note" as="textarea" label="Notes (optional)" placeholder="Anything we should know?" />
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="relative inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                Request booking <ArrowRight className="h-4 w-4"/>
                <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
              </button>
              <Link to="/app/schedule" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">Go to schedule</Link>
            </div>
          </form>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

function RescheduleModal({ open, onClose, appt }){
  return (
    <AnimatePresence>
      {open && (
        <ModalShell title={`Reschedule: ${appt?.title || 'Appointment'}`} onClose={onClose}>
          <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field id="newDate" type="date" label="New date" />
              <Field id="newTime" type="time" label="New time" />
            </div>
            <Field id="reason" as="textarea" label="Reason (optional)" placeholder="Short note" />
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="relative inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                Send request <ArrowRight className="h-4 w-4"/>
                <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
              </button>
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">Cancel</button>
            </div>
          </form>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}
