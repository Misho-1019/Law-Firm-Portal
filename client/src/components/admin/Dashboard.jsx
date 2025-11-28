import { useEffect, useState } from "react";
import { Link } from "react-router";
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
} from "lucide-react";
import appointmentsService from "../../services/appointmentsService";
import Dates from "./calendar/Dates";
import UpcomingList from "./upcoming/UpcomingList";
import timeOffService from "../../services/timeOffService";

/* ---- Framer Motion components (fix ESLint unused import) ---- */
const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionAside = motion.aside;

export default function AdminDashboard() {
  const timestamp = new Date();
  const [appointments, setAppointments] = useState([]);
  const [timeOffItems, setTimeOffItems] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)

    Promise.all([
      appointmentsService.getAll(),
      timeOffService.getAll(),
    ])
    .then(([appts, timeOff]) => {
      setAppointments(appts);
      setTimeOffItems(timeOff);
    })
    .finally(() => setIsLoading(false))
  }, [])

  const allAppointments = appointments[0] || [];

  const pendingAppointments = allAppointments.filter(
    (x) => x.status === "PENDING"
  );

  const upcoming = allAppointments.filter((a) => {
    const appt = new Date(a?.startsAt);
    return appt > timestamp;
  });

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-[#334155] dark:text-[#94A3B8]">
        Loading calendar…
      </div>
    );
  }

  return (
    // <div className={isDark? 'dark':''}>
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        {/* Hero / search */}
        <section className="bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#1F2937]">
          <div className="mx-auto max-w-7xl px-5 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  Welcome back
                </h1>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Here’s your day at a glance.
                </p>
              </div>
              <div className="w-full md:w-96">
                <label htmlFor="globalSearch" className="sr-only">
                  Search
                </label>
                <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Search className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
                    <input
                      id="globalSearch"
                      className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
                      placeholder="Search clients, matters, or events"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/create"
                className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
              >
                <Plus className="h-4 w-4" /> New appointment
                <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
              </Link>
              <Link className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">
                <UserPlus className="h-4 w-4" /> Create client
              </Link>
              <Link className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]">
                <Share2 className="h-4 w-4" /> Share availability
              </Link>
            </div>
          </div>
        </section>

        {/* KPI cards */}
        <main className="mx-auto max-w-7xl px-5 py-8 grid gap-6 lg:grid-cols-3">
          <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5"
          >
            <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
              Slots today
            </div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-semibold">
                {allAppointments.length}
              </div>
              <div className="text-xs text-[#334155] dark:text-[#94A3B8]">
                available
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5"
          >
            <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
              Upcoming
            </div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-semibold">{upcoming.length}</div>
              <div className="text-xs text-[#334155] dark:text-[#94A3B8]">
                {upcoming.length > 1 ? "appointments" : "appointment"}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5"
          >
            <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
              Pending approvals
            </div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-semibold">
                {pendingAppointments.length}
              </div>
              <div className="text-xs text-[#334155] dark:text-[#94A3B8]">
                awaiting
              </div>
            </div>
          </MotionDiv>

          {/* Calendar preview (left) */}
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            {/* {allAppointments.map(appointment => <Dates key={appointment._id} {...appointment} />)} */}
            <Dates appointments={allAppointments} timeOff={timeOffItems} />
            {/* Days grid */}
          </MotionSection>

          {/* Upcoming list (right) */}
          <MotionAside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Upcoming</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Next appointments
                </p>
              </div>
              <Link
                to="/appointments"
                className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5 border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

            <ul className="p-4 space-y-3">
              {upcoming.map(appointment => <UpcomingList key={appointment._id} {...appointment}/>)}
              {upcoming.length > 0 ? (
                <li className="rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] p-3 text-sm text-[#334155] dark:text-[#94A3B8] flex items-center justify-between">
                  <span>No more items.</span>
                </li>
              ) : (
                <h3 className="text-center text-lg font-medium mt-10 text-[#334155] dark:text-[#94A3B8]">
                  You don't have any appointments yet
                </h3>
              )}
            </ul>
          </MotionAside>

          {/* Activity feed / notices full width */}
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            <div className="p-4 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent activity</h3>
            </div>
            <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
            <ul className="p-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#166534] mt-0.5" />
                <div>
                  <span className="font-medium">Meeting confirmed</span> — Elena
                  Ivanova, tomorrow 16:00
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-[#B45309] mt-0.5" />
                <div>
                  <span className="font-medium">Awaiting approval</span> —
                  Contract review for Maria Georgieva
                </div>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-[#B91C1C] mt-0.5" />
                <div>
                  <span className="font-medium">Canceled</span> — Trademark
                  brief with Stoyan Kolev
                </div>
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
