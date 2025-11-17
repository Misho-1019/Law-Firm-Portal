import { motion } from "framer-motion";
import {
  Plus,
  UserPlus,
  Share2,
  Search,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import appointmentsService from "../../services/appointmentsService";

/* ---- Framer Motion elements ---- */
const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionAside = motion.aside;

export default function AdminDashboard(){
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    appointmentsService.getAll()
       .then(setAppointments)
  }, [])

  console.log(appointments);

  return (
    <div className='dark'>
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
                    <input id="globalSearch" className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]" placeholder="Search clients, matters, or events" disabled readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions (disabled) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <span className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white opacity-60 cursor-not-allowed select-none">
                <Plus className="h-4 w-4" /> New appointment
              </span>
              <span className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 opacity-60 cursor-not-allowed select-none">
                <UserPlus className="h-4 w-4" /> Create client
              </span>
              <span className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 opacity-60 cursor-not-allowed select-none">
                <Share2 className="h-4 w-4" /> Share availability
              </span>
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

          {/* Calendar preview (static) */}
          <MotionSection initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35}} className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="flex items-center justify-between p-4 pb-3">
              <div>
                <h2 className="text-lg font-semibold">This month</h2>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">November 2025</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 opacity-60 cursor-not-allowed select-none">Prev</span>
                <span className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 opacity-60 cursor-not-allowed select-none">Today</span>
                <span className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 opacity-60 cursor-not-allowed select-none">Next</span>
              </div>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-2 px-4 pt-4 text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
              <div className="text-center">Mon</div>
              <div className="text-center">Tue</div>
              <div className="text-center">Wed</div>
              <div className="text-center">Thu</div>
              <div className="text-center">Fri</div>
              <div className="text-center">Sat</div>
              <div className="text-center">Sun</div>
            </div>

            {/* Days grid (non-interactive, fixed for Nov 2025; Mon-first) */}
            <div className="grid grid-cols-7 gap-2 p-4">
              {/* Oct 27–31 */}
              {[27,28,29,30,31].map((n)=> (
                <div key={`oct-${n}`} className="relative h-20 rounded-xl border text-left p-3 bg-white/60 dark:bg-[#0F1117]/60 border-dashed border-[#E5E7EB] dark:border-[#1F2937] opacity-70">
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
              {/* Nov 1–2 */}
              {[1,2].map((n)=> (
                <div key={`nov-a-${n}`} className="relative h-20 rounded-xl border text-left p-3 bg-white dark:bg-[#0F1117] border-[#E5E7EB] dark:border-[#1F2937]">
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
              {/* Nov 3–9 */}
              {[3,4,5,6,7,8,9].map((n)=> (
                <div key={`nov-b-${n}`} className="relative h-20 rounded-xl border text-left p-3 bg-white dark:bg-[#0F1117] border-[#E5E7EB] dark:border-[#1F2937]">
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
              {/* Nov 10–16 */}
              {[10,11,12,13,14,15,16].map((n)=> (
                <div key={`nov-c-${n}`} className="relative h-20 rounded-xl border text-left p-3 bg-white dark:bg-[#0F1117] border-[#E5E7EB] dark:border-[#1F2937]">
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
              {/* Nov 17–23 */}
              {[17,18,19,20,21,22,23].map((n)=> (
                <div key={`nov-d-${n}`} className="relative h-20 rounded-xl border text-left p-3 bg-white dark:bg-[#0F1117] border-[#E5E7EB] dark:border-[#1F2937]">
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
              {/* Nov 24–30 */}
              {[24,25,26,27,28,29,30].map((n)=> (
                <div key={`nov-e-${n}`} className="relative h-20 rounded-xl border text-left p-3 bg-white dark:bg-[#0F1117] border-[#E5E7EB] dark:border-[#1F2937]">
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
              {/* Dec 1–7 */}
              {[1,2,3,4,5,6,7].map((n)=> (
                <div key={`dec-${n}`} className="relative h-20 rounded-xl border text-left p-3 bg-white/60 dark:bg-[#0F1117]/60 border-dashed border-[#E5E7EB] dark:border-[#1F2937] opacity-70">
                  <span className="text-sm font-semibold">{n}</span>
                </div>
              ))}
            </div>
          </MotionSection>

          {/* Upcoming list (right) */}
          <MotionAside initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35, delay:.05}} className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Upcoming</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">Next 24 hours</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] px-3 py-1.5 border border-[#2F80ED] opacity-60 cursor-not-allowed select-none">
                View all
              </span>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

            <ul className="p-4 space-y-3">
              <li className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                    <span className="font-semibold">09:00 – 09:30</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-[rgba(22,101,52,0.12)] text-[#166534]"><CheckCircle2 className="h-3.5 w-3.5"/> Confirmed</span>
                </div>
                <div className="mt-2 text-sm">
                  <div className="font-medium">Ivan Petrov</div>
                  <div className="text-[#334155] dark:text-[#94A3B8]">Initial consultation</div>
                </div>
              </li>
              <li className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                    <span className="font-semibold">10:00 – 10:45</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-[rgba(180,83,9,0.12)] text-[#B45309]"><AlertCircle className="h-3.5 w-3.5"/> Pending</span>
                </div>
                <div className="mt-2 text-sm">
                  <div className="font-medium">Maria Georgieva</div>
                  <div className="text-[#334155] dark:text-[#94A3B8]">Contract review</div>
                </div>
              </li>
              <li className="rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                    <span className="font-semibold">14:00 – 14:30</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-[rgba(22,101,52,0.12)] text-[#166534]"><CheckCircle2 className="h-3.5 w-3.5"/> Confirmed</span>
                </div>
                <div className="mt-2 text-sm">
                  <div className="font-medium">Nikolay Dimitrov</div>
                  <div className="text-[#334155] dark:text-[#94A3B8]">Litigation prep</div>
                </div>
              </li>
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
          © LexSchedule. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
