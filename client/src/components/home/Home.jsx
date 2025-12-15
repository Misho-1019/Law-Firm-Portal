import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Shield,
  Bell,
  ArrowRight,
  ChevronRight,
  X
} from "lucide-react";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { availabilityService } from "../../services/availabilityService";
import { formatSofiaDayLabel, formatSofiaTime } from "../../utils/dates";
import { endTime } from "../../utils/time";

/* ---- Framer Motion components (fix ESLint unused import) ---- */
const MotionDiv = motion.div;
const MotionSection = motion.section;

/* ----------------------------------------------------------
   Public Home Page (unauthenticated)
---------------------------------------------------------- */
export default function Home() {
  const { email } = useAuth()

  const [isLoadingSlots, setIsLoadingSlots] = useState(true)
  const [nextSlots, setNextSlots] = useState({ date: null, slots: [] })

  useEffect(() => {
    let cancelled = false;

    async function loadNextSlots() {
      try {
        setIsLoadingSlots(true);

        const res = await availabilityService.getNextSlots(7, 120)

        if (!cancelled) {
          setNextSlots(res || { date: null, slots: [] });
        }
      } catch (err) {
        console.error('Failed to load next free slots for home card:', err);
        
        if (!cancelled) {
          setNextSlots({ date: null, slots: [] })
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSlots(false)
        }
      }
    }

    loadNextSlots()

    return () => {
      cancelled = true;
    }
  }, [])

  const allFreeSlots = nextSlots.slots || [];  
  
  return (
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
              {email && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link to='/create' className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-5 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                    Create appointment <ArrowRight className="h-4 w-4" />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                  </Link>
                  <Link to="/client" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-5 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">My Dashboard</Link>
                  <Link to="/schedule" className="inline-flex items-center justify-center rounded-2xl border border-transparent px-5 py-2.5 font-semibold text-white bg-[#0B1220]/20 hover:bg-white/10">View Schedule</Link>
                </div>
              )}
              {!email && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link to='/create' className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-5 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                  Create appointment <ArrowRight className="h-4 w-4" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-5 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726] font-semibold">Sign in</Link>
                <Link to="/register" className="inline-flex items-center justify-center rounded-2xl border border-transparent px-5 py-2.5 font-semibold text-white bg-[#0B1220]/20 hover:bg-white/10">Register</Link>
              </div>
              )}
              <div className="mt-6 flex items-center gap-5 text-xs text-[#334155] dark:text-[#94A3B8]">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4"/>Secure</div>
                <div className="flex items-center gap-2"><Bell className="h-4 w-4"/>Reminders</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4"/>Client-friendly</div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
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
              
                {/* Viber button */}
                <a
                  href="viber://chat?number=%2B359889116617"
                  className="
                    inline-flex items-center gap-2 rounded-2xl 
                    border border-[#E5E7EB] dark:border-[#1F2937] 
                    px-4 py-2 text-sm font-semibold
                    text-[#7C3AED] dark:text-[#A855F7]
                    bg-white dark:bg-[#0F172A]
                    hover:bg-[#F5F3FF] dark:hover:bg-[#1E1B4B]
                    transition-colors
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M18.5 3h-13A2.5 2.5 0 003 5.5v13.086l2.793-2.793A1 1 0 016.5 15.5h12A2.5 2.5 0 0021 13V5.5A2.5 2.5 0 0018.5 3zm-4.04 10.013c-.79.79-2.98.066-4.63-1.584-1.65-1.65-2.373-3.84-1.584-4.63.21-.21.53-.33.95-.33.27 0 .57.05.9.15a.75.75 0 01.52.53l.26 1.03a.75.75 0 01-.19.7l-.57.57c.21.55.69 1.17 1.16 1.64.47.47 1.09.95 1.64 1.16l.57-.57a.75.75 0 01.7-.19l1.03.26a.75.75 0 01.53.52c.2.76.22 1.35-.08 1.65z" />
                  </svg>
                  Chat on Viber
                </a>
              </div>
            </div>

            {/* Card preview */}
            <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5">
              {isLoadingSlots ? (
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-20 rounded bg-[#E5E7EB] dark:bg-[#1F2937]" />
                      <div className="mt-2 h-5 w-40 rounded bg-[#E5E7EB] dark:bg-[#1F2937]" />
                    </div>
                    <div className="h-7 w-16 rounded-xl bg-[#E5E7EB] dark:bg-[#1F2937]" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#020617]"
                      />
                    ))}
                  </div>
                </div>
              ) : !nextSlots.date || allFreeSlots.length === 0 ? (
                <div>
                  <div className="text-sm text-[#334155] dark:text-[#94A3B8]">Next available</div>
                  <div className="mt-1 text-xl font-semibold">
                    No free slots in the next 7 days
                  </div>
                  <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                    Please check again later or contact the office directly.
                  </p>
                </div>
              ) : (
                (() => {
                  const first = new Date(allFreeSlots[0])                 
                  const last = endTime(String(formatSofiaTime(first)), 120)

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                            Next available
                          </div>
                          <div className="text-xl font-semibold">
                            {formatSofiaDayLabel(first)}{' '}
                            {formatSofiaTime(first)}–{last}
                          </div>
                        </div>
                        <Link to='/create' className="rounded-xl bg-[#2F80ED]/10 text-[#2F80ED] px-3 py-1 text-sm font-semibold">
                          Open
                        </Link>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                        {allFreeSlots.slice(0, 3).map((iso, idx) => {
                          const d = new Date(iso);
                          return (
                            <div
                              key={iso}
                              className={`rounded-xl border px-3 py-2 ${
                                idx === 0
                                  ? "bg-[#2F80ED]/10 border-[#2F80ED]/40"
                                  : "border-[#E5E7EB] dark:border-[#1F2937]"
                              }`}
                            >
                              <div className="font-semibold">
                                {formatSofiaTime(d)}
                              </div>
                              <div className="text-[#334155] dark:text-[#94A3B8]">
                                Starts at {formatSofiaTime(d)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <Link
                        to="/create"
                        className="mt-4 inline-flex items-center gap-2 rounded-2xl w-full border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors"
                      >
                        Book this slot <ChevronRight className="h-4 w-4" />
                      </Link>
                    </>
                  )
                })()
              )}
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
              <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                Create an appointment as a guest, or sign in for faster checkout.
              </p>
              <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                Prefer to talk with me?{" "}
                <a
                  href="tel:+359889116617"
                  className="font-semibold text-[#2F80ED]"
                >
                  +359 88 911 6617
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to='/create' className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40">
                Create appointment <ArrowRight className="h-4 w-4" />
                <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
              </Link>
              {!email && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 hover:bg-[#2F80ED] hover:text-white transition-colors">Sign in</Link>
                  <Link to="/register" className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">Register</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © {new Date().getFullYear()} LexSchedule. All rights reserved.
        </footer>
      </div>
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
