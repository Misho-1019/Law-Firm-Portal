import React from "react";
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
  Monitor,
  Moon,
  Sun,
  X
} from "lucide-react";

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionAside = motion.aside;

/* ----------------------------------------------------------
   Tri-state theme hook (system / light / dark)
---------------------------------------------------------- */
function useThemeMode() {
  const getInitial = () => (typeof window === 'undefined' ? 'system' : localStorage.getItem('theme-mode') || 'system');
  const [mode, setMode] = React.useState(getInitial);
  const [systemDark, setSystemDark] = React.useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    try { mql.addEventListener('change', onChange); } catch { mql.addListener(onChange); }
    return () => { try { mql.removeEventListener('change', onChange); } catch { mql.removeListener(onChange); } };
  }, []);

  React.useEffect(() => {
    if (mode !== 'system') localStorage.setItem('theme-mode', mode);
    else localStorage.removeItem('theme-mode');
  }, [mode]);

  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  const cycle = () => setMode((m) => (m === 'system' ? 'dark' : m === 'dark' ? 'light' : 'system'));
  return { mode, isDark, cycle };
}

function ThemeToggle() {
  const { mode, cycle } = useThemeMode();
  const Icon = mode === 'system' ? Monitor : mode === 'dark' ? Moon : Sun;
  return (
    <button
      onClick={cycle}
      className="inline-flex items-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-1.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
      title={`Theme: ${mode} (click to change)`}
    >
      <Icon className="h-4 w-4" /> <span className="capitalize">{mode}</span>
    </button>
  );
}

/* ----------------------------------------------------------
   Status pill (semantic, accessible)
---------------------------------------------------------- */
function StatusPill({ status }) {
  const map = {
    confirmed: { bg: 'bg-[rgba(22,101,52,0.12)]', fg: 'text-[#166534]', label: 'Confirmed', Icon: CheckCircle2 },
    pending:   { bg: 'bg-[rgba(180,83,9,0.12)]',  fg: 'text-[#B45309]', label: 'Pending',   Icon: AlertCircle },
    canceled:  { bg: 'bg-[rgba(185,28,28,0.12)]', fg: 'text-[#B91C1C]', label: 'Canceled',  Icon: XCircle },
    info:      { bg: 'bg-[rgba(3,105,161,0.12)]',  fg: 'text-[#0369A1]', label: 'Info',      Icon: AlertCircle },
  };
  const S = map[status] || map.info;
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
        className="relative mx-auto mt-20 w-[92%] max-w-lg rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl"
      >
        <div className="flex items-center justify-between p-4 pb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"><X className="h-5 w-5"/></button>
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
              <a href="/app/schedule" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">Go to schedule</a>
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

/* ----------------------------------------------------------
   Client Home (authenticated client portal)
---------------------------------------------------------- */
export default function ClientDashboard(){
  const { isDark } = useThemeMode();
  const [openBook, setOpenBook] = React.useState(false);
  const [openResched, setOpenResched] = React.useState(false);

  const nextAppt = {
    id: 'n1',
    when: 'Tue, Nov 18 · 10:00 – 10:45',
    title: 'Contract review',
    lawyer: 'Atty. Petrov',
    status: 'confirmed',
    address: 'Law Office · 12 Vitosha Blvd',
    phone: '+359 2 123 4567'
  };

  const upcoming = [
    { id:'a1', date:'Nov 18', time:'10:00 – 10:45', title:'Contract review', status:'confirmed' },
    { id:'a2', date:'Nov 25', time:'14:30 – 15:00', title:'Follow-up call',  status:'pending' },
  ];

  const updates = [
    { id:'u1', kind:'info', text:'Please bring your contract draft (PDF).' },
    { id:'u2', kind:'info', text:'Parking entrance is on Shipka St.' },
  ];

  const documents = [
    { id:'d1', name:'NDA_draft.pdf', size:'124 KB' },
    { id:'d2', name:'Client_Onboarding.pdf', size:'88 KB' },
  ];

  return (
    <div className={isDark? 'dark':''}>
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
                  <div className="text-xl font-semibold">{nextAppt.when}</div>
                  <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{nextAppt.title} · with {nextAppt.lawyer}</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]"><MapPin className="h-4 w-4"/>{nextAppt.address}</div>
                    <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8]"><Phone className="h-4 w-4"/>{nextAppt.phone}</div>
                    <StatusPill status={nextAppt.status} />
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
              {upcoming.map(a => (
                <li key={a.id} className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                      <span className="font-semibold">{a.date} · {a.time}</span>
                    </div>
                    <StatusPill status={a.status} />
                  </div>
                  <div className="mt-2 text-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-[#334155] dark:text-[#94A3B8]">Office · 12 Vitosha Blvd</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>setOpenResched(true)} className="rounded-xl border border-[#2F80ED] text-[#2F80ED] px-3 py-1.5 hover:bg-[#2F80ED] hover:text-white transition-colors">Reschedule</button>
                      <button className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Cancel</button>
                    </div>
                  </div>
                </li>
              ))}
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
              <button className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] text-sm">
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
      <RescheduleModal open={openResched} onClose={()=>setOpenResched(false)} appt={{ title: nextAppt.title }} />
    </div>
  );
}
