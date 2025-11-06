import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Plus,
  UserPlus,
  Share2,
  Search,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Monitor,
  Moon,
  Sun
} from "lucide-react";

/* ---- Framer Motion components (fix ESLint unused import) ---- */
const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionAside = motion.aside;

// --- Tri-state theme (system / light / dark) ---
function useThemeMode() {
  const getInitial = () =>
    (typeof window === 'undefined' ? 'system' : localStorage.getItem('theme-mode') || 'system');
  const [mode, setMode] = useState(getInitial);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    try { mql.addEventListener('change', onChange); } catch { mql.addListener(onChange); }
    return () => { try { mql.removeEventListener('change', onChange); } catch { mql.removeListener(onChange); } };
  }, []);

  useEffect(() => {
    if (mode !== 'system') localStorage.setItem('theme-mode', mode);
    else localStorage.removeItem('theme-mode');
  }, [mode]);

  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  const cycle = () => setMode((m) => (m === 'system' ? 'dark' : m === 'dark' ? 'light' : 'system'));
  return { mode, isDark, cycle };
}

/* --- Status pill (UI only) --- */
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

// --- Small helpers for dates ---
const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
function isSameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function mondayFirst(d){ return (d.getDay()+6)%7; }
function getWeeks(year, month){
  const first = new Date(year, month, 1);
  const pad = mondayFirst(first);
  const start = new Date(year, month, 1 - pad);
  const weeks = [];
  const cur = new Date(start);
  for(let w=0; w<6; w++){
    const row=[]; for(let i=0;i<7;i++){ row.push(new Date(cur)); cur.setDate(cur.getDate()+1); }
    weeks.push(row);
  }
  return weeks;
}

// --- Sample data (UI only) ---
const sampleUpcoming = [
  { id:'a1', when:'09:00 – 09:30', client:'Ivan Petrov',     title:'Initial consultation', status:'confirmed' },
  { id:'a2', when:'10:00 – 10:45', client:'Maria Georgieva', title:'Contract review',      status:'pending' },
  { id:'a3', when:'14:00 – 14:30', client:'Nikolay Dimitrov',title:'Litigation prep',      status:'confirmed' },
];

export default function AdminDashboard(){
  const { isDark } = useThemeMode();
  const now = new Date();
  const [current, setCurrent] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(now);
  const weeks = useMemo(()=>getWeeks(current.y, current.m), [current]);

  const headerLabel = new Intl.DateTimeFormat(undefined, { month:'long', year:'numeric' }).format(new Date(current.y, current.m, 1));

  const prevMonth = () => setCurrent(({y,m}) => m===0?{y:y-1,m:11}:{y,m:m-1});
  const nextMonth = () => setCurrent(({y,m}) => m===11?{y:y+1,m:0}:{y,m:m+1});

  return (
    <div className={isDark? 'dark':''}>
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        
        {/* Hero / search */}
        <section className="bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#1F2937]">
          <div className="mx-auto max-w-7xl px-5 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">Welcome back</h1>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">Here’s your day at a glance.</p>
              </div>
              <div className="w-full md:w-96">
                <label htmlFor="globalSearch" className="sr-only">Search</label>
                <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Search className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                    <input id="globalSearch" className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]" placeholder="Search clients, matters, or events" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                <Plus className="h-4 w-4" /> New appointment
                <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">
                <UserPlus className="h-4 w-4" /> Create client
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">
                <Share2 className="h-4 w-4" /> Share availability
              </button>
            </div>
          </div>
        </section>

        {/* KPI cards */}
        <main className="mx-auto max-w-7xl px-5 py-8 grid gap-6 lg:grid-cols-3">
          <MotionDiv initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.3}} className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5">
            <div className="text-sm text-[#334155] dark:text-[#94A3B8]">Slots today</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-semibold">15</div>
              <div className="text-xs text-[#334155] dark:text-[#94A3B8]">available</div>
            </div>
          </MotionDiv>

          <MotionDiv initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35, delay:.05}} className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5">
            <div className="text-sm text-[#334155] dark:text-[#94A3B8]">Upcoming</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-semibold">8</div>
              <div className="text-xs text-[#334155] dark:text-[#94A3B8]">this week</div>
            </div>
          </MotionDiv>

          <MotionDiv initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.4, delay:.1}} className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5">
            <div className="text-sm text-[#334155] dark:text-[#94A3B8]">Pending approvals</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-semibold">3</div>
              <div className="text-xs text-[#334155] dark:text-[#94A3B8]">awaiting</div>
            </div>
          </MotionDiv>

          {/* Calendar preview (left) */}
          <MotionSection initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35}} className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="flex items-center justify-between p-4 pb-3">
              <div>
                <h2 className="text-lg font-semibold">This month</h2>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">{headerLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Prev</button>
                <button onClick={()=>{ const d=new Date(); setCurrent({y:d.getFullYear(),m:d.getMonth()}); setSelected(d); }} className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Today</button>
                <button onClick={nextMonth} className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Next</button>
              </div>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-2 px-4 pt-4 text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
              {weekdays.map(w => <div key={w} className="text-center">{w}</div>)}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2 p-4">
              {weeks.flat().map((d, idx) => {
                const inMonth = d.getMonth()===current.m;
                const isToday = isSameDay(d, now);
                const isSel = isSameDay(d, selected);
                return (
                  <button key={idx} onClick={()=>setSelected(new Date(d))} className={[
                      "relative h-20 rounded-xl border text-left p-3 transition-colors",
                      inMonth ? "bg-white dark:bg-[#0F1117] border-[#E5E7EB] dark:border-[#1F2937]" : "bg-white/60 dark:bg-[#0F1117]/60 border-dashed border-[#E5E7EB] dark:border-[#1F2937] opacity-70",
                      isToday ? "border-transparent [background:linear-gradient(#fff,#fff),conic-gradient(from_180deg,#2F80ED33,#06B6D433,#7C3AED33,#2F80ED33)] [background-origin:border-box] [background-clip:padding-box,border-box] dark:[background:linear-gradient(#0F1117,#0F1117),conic-gradient(from_180deg,#2F80ED33,#06B6D433,#7C3AED33,#2F80ED33)]" : "",
                      isSel ? "bg-[#2F80ED]/10 border-[#2F80ED]/40" : "",
                    ].join(' ')}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{d.getDate()}</span>
                      {isToday && <span className="rounded-md bg-[#2F80ED]/10 text-[#2F80ED] px-2 py-0.5 text-[10px] font-semibold">Today</span>}
                    </div>
                    {isSel && <span className="pointer-events-none absolute left-3 right-3 bottom-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent"/>}
                  </button>
                );
              })}
            </div>
          </MotionSection>

          {/* Upcoming list (right) */}
          <MotionAside initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35, delay:.05}} className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Upcoming</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">Next 24 hours</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5 border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors">
                View all
              </button>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

            <ul className="p-4 space-y-3">
              {sampleUpcoming.map(a => (
                <li key={a.id} className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                      <span className="font-semibold">{a.when}</span>
                    </div>
                    <StatusPill status={a.status} />
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="font-medium">{a.client}</div>
                    <div className="text-[#334155] dark:text-[#94A3B8]">{a.title}</div>
                  </div>
                </li>
              ))}
              <li className="rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] p-3 text-sm text-[#334155] dark:text-[#94A3B8] flex items-center justify-between">
                <span>No more items.</span>
                <ChevronRight className="h-4 w-4"/>
              </li>
            </ul>
          </MotionAside>

          {/* Activity feed / notices full width */}
          <MotionSection initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35}} className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="p-4 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent activity</h3>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            <ul className="p-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#166534] mt-0.5"/>
                <div><span className="font-medium">Meeting confirmed</span> — Elena Ivanova, tomorrow 16:00</div>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-[#B45309] mt-0.5"/>
                <div><span className="font-medium">Awaiting approval</span> — Contract review for Maria Georgieva</div>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-[#B91C1C] mt-0.5"/>
                <div><span className="font-medium">Canceled</span> — Trademark brief with Stoyan Kolev</div>
              </li>
            </ul>
          </MotionSection>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © {new Date().getFullYear()} LexSchedule. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
