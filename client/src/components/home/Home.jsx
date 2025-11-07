import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Shield,
  Bell,
  ArrowRight,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  X
} from "lucide-react";
import { Link } from "react-router";

/* ---- Framer Motion components (fix ESLint unused import) ---- */
const MotionDiv = motion.div;
const MotionSection = motion.section;

/* ----------------------------------------------------------
   Tri-state theme hook (system / light / dark)
---------------------------------------------------------- */
// function useThemeMode() {
//   const getInitial = () => (typeof window === 'undefined' ? 'system' : localStorage.getItem('theme-mode') || 'system');
//   const [mode, setMode] = useState(getInitial);
//   const [systemDark, setSystemDark] = useState(() =>
//     typeof window !== 'undefined' && window.matchMedia
//       ? window.matchMedia('(prefers-color-scheme: dark)').matches
//       : false
//   );

//   useEffect(() => {
//     if (!window.matchMedia) return;
//     const mql = window.matchMedia('(prefers-color-scheme: dark)');
//     const onChange = (e) => setSystemDark(e.matches);
//     try { mql.addEventListener('change', onChange); } catch { mql.addListener(onChange); }
//     return () => { try { mql.removeEventListener('change', onChange); } catch { mql.removeListener(onChange); } };
//   }, []);

//   useEffect(() => {
//     if (mode !== 'system') localStorage.setItem('theme-mode', mode);
//     else localStorage.removeItem('theme-mode');
//   }, [mode]);

//   const isDark = mode === 'dark' || (mode === 'system' && systemDark);
//   const cycle = () => setMode((m) => (m === 'system' ? 'dark' : m === 'dark' ? 'light' : 'system'));
//   return { mode, isDark, cycle };
// }

/* ----------------------------------------------------------
   Quick Book Modal (UI only)
---------------------------------------------------------- */
function QuickBookModal({ open, onClose }) {
  const stop = (e) => e.stopPropagation();
  return (
    <AnimatePresence>
      {open && (
        <MotionDiv
          className="fixed inset-0 z-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
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
              <h3 className="text-lg font-semibold">Book an appointment</h3>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

            <form className="p-4 space-y-4" onSubmit={(e)=>e.preventDefault()}>
              <Field id="name" label="Full name" placeholder="Your name" />
              <Field id="email" type="email" label="Email" placeholder="you@example.com" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field id="date" type="date" label="Date" />
                <Field id="time" type="time" label="Time" />
              </div>
              <Field id="note" as="textarea" label="Note (optional)" placeholder="Short context" />

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="relative inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                  Continue as guest <ArrowRight className="h-4 w-4" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                </button>
                <Link to="/register" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">Register</Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">Sign in</Link>
              </div>
            </form>
          </MotionSection>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

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

/* ----------------------------------------------------------
   Public Home Page (unauthenticated)
---------------------------------------------------------- */
export default function Home() {
  // const { isDark } = useThemeMode();
  const [open, setOpen] = useState(false);

  return (
    // <div className={isDark ? "dark" : ""}>
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
               style={{background:"radial-gradient(600px 200px at 50% -10%, #2F80ED 0%, transparent 60%)"}} />
          <div className="mx-auto max-w-7xl px-5 py-14 grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                Calm, modern scheduling for law firms
              </h1>
              <p className="mt-3 text-[#334155] dark:text-[#94A3B8] max-w-prose">
                Keep your clients on track with clear availability, accessible states, and trustworthy Azure CTAs.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={()=>setOpen(true)} className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-5 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                  Create appointment <ArrowRight className="h-4 w-4" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                </button>
                <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-5 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">Sign in</Link>
                <Link to="/register" className="inline-flex items-center justify-center rounded-2xl border border-transparent px-5 py-2.5 font-semibold text-white bg-[#0B1220]/20 hover:bg-white/10">Register</Link>
              </div>
              <div className="mt-6 flex items-center gap-5 text-xs text-[#334155] dark:text-[#94A3B8]">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4"/>Secure</div>
                <div className="flex items-center gap-2"><Bell className="h-4 w-4"/>Reminders</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4"/>Client-friendly</div>
              </div>
            </div>

            {/* Card preview */}
            <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#334155] dark:text-[#94A3B8]">Next available</div>
                  <div className="text-xl font-semibold">Today 15:00–17:00</div>
                </div>
                <div className="rounded-xl bg-[#2F80ED]/10 text-[#2F80ED] px-3 py-1 text-sm font-semibold">Open</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                {["Tue", "Wed", "Thu"].map((d,i)=> (
                  <div key={d} className={`rounded-xl border px-3 py-2 ${i===0?"bg-[#2F80ED]/10 border-[#2F80ED]/40":"border-[#E5E7EB] dark:border-[#1F2937]"}`}>
                    <div className="font-semibold">{d}</div>
                    <div className="text-[#334155] dark:text-[#94A3B8]">15:00 – 17:00</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-2xl w-full border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors">
                Book this slot <ChevronRight className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-14">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard icon={<CalendarIcon className="h-5 w-5"/>} title="Clear calendar">
              Accessible colors show confirmed, pending, and canceled at a glance.
            </FeatureCard>
            <FeatureCard icon={<Clock className="h-5 w-5"/>} title="Frictionless booking">
              Clients can pick a time in seconds—no login required.
            </FeatureCard>
            <FeatureCard icon={<Shield className="h-5 w-5"/>} title="Private by default">
              Your firm controls what’s visible and who can book.
            </FeatureCard>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="bg-white dark:bg-[#111827] border-y border-[#E5E7EB] dark:border-[#1F2937]">
          <div className="mx-auto max-w-7xl px-5 py-14">
            <h2 className="text-xl font-semibold">How it works</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <Step n={1} title="Pick a time">Choose an open slot that fits your schedule.</Step>
              <Step n={2} title="Share details">Tell us who you are and what you need.</Step>
              <Step n={3} title="Get confirmation">Receive a confirmation and reminders.</Step>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section id="trust" className="mx-auto max-w-7xl px-5 py-10">
          <div className="text-center text-sm text-[#334155] dark:text-[#94A3B8]">Trusted by teams who value clarity</div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 opacity-80">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] bg-white/60 dark:bg-[#0F1117]/60" />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Ready to book?</h3>
              <p className="text-sm text-[#334155] dark:text-[#94A3B8]">Create an appointment as a guest, or sign in for faster checkout.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={()=>setOpen(true)} className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                Create appointment <ArrowRight className="h-4 w-4" />
                <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
              </button>
              <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors">Sign in</Link>
              <Link to="/register" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Register</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © {new Date().getFullYear()} LexSchedule. All rights reserved.
        </footer>
      </div>

      {/* Modal */}
      <QuickBookModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

/* ----------------------------------------------------------
   Tiny presentational components
---------------------------------------------------------- */
function FeatureCard({ icon, title, children}){
  return (
    <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F80ED]/10 text-[#2F80ED]">{icon}</div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">{children}</p>
    </div>
  );
}

function Step({ n, title, children}){
  return (
    <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-[#2F80ED]/10 text-[#2F80ED] grid place-items-center font-semibold">{n}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="mt-2 text-sm text-[#334155] dark:text-[#94A3B8]">{children}</p>
    </div>
  );
}
