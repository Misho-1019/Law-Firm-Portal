// src/components/admin/schedule/ScheduleOverview.jsx
/* UI-only, palette-matched (no functionality) */
import { Calendar as CalendarIcon, Clock, Settings, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const MotionSection = motion.section;

const MOCK_SCHEDULE = {
  tz: "Europe/Sofia",
  days: [
    { weekday: 1, intervals: [{ from: "09:00", to: "12:00" }, { from: "13:00", to: "17:00" }] },
    { weekday: 2, intervals: [{ from: "09:00", to: "12:00" }, { from: "13:00", to: "17:00" }] },
    { weekday: 3, intervals: [{ from: "09:00", to: "12:00" }, { from: "13:00", to: "17:00" }] },
    { weekday: 4, intervals: [{ from: "10:00", to: "16:00" }] },
    { weekday: 5, intervals: [{ from: "10:00", to: "14:00" }] },
  ],
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleOverview() {
  const { tz, days } = MOCK_SCHEDULE;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-[#E5E7EB]" />
            <h1 className="text-2xl font-semibold text-[#E5E7EB]">
              Working Schedule
            </h1>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-[#1F2937] px-4 py-2">
              <MapPin className="h-4 w-4" />
              Timezone: <span className="font-medium text-[#E5E7EB]">{tz}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-[2.2fr,1fr] items-stretch">
          {/* Main card */}
          <MotionSection
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-[#020617] border border-[#1F2937] shadow-sm p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#E5E7EB]">Overview</h2>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  These are the default working hours used when offering appointment slots.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-4 py-1.5 text-xs text-[#E5E7EB] border border-[#1F2937]">
                <Clock className="h-4 w-4" />
                Configured by Admin
              </div>
            </div>

            {/* Legend */}
            <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#020617] px-3 py-1 border border-[#1F2937]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2F80ED]" />
                Available slots
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#020617] px-3 py-1 border border-[#1F2937]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EAB308]" />
                Partial day
              </span>
            </div>

            {/* Weekly cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 7 }).map((_, idx) => {
                const config = days.find((d) => d.weekday === idx);
                const isActive = !!config;
                const intervals = config?.intervals || [];

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border text-sm p-4 flex flex-col gap-3 ${
                      isActive
                        ? "border-[#1F2937] bg-[#020617]"
                        : "border-slate-800/60 bg-slate-950/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#E5E7EB]">
                        {WEEKDAYS[idx]}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-0.5 text-[11px] ${
                          isActive
                            ? "bg-[rgba(34,197,94,0.08)] text-emerald-400 border border-emerald-900/60"
                            : "bg-slate-900 text-slate-500 border border-slate-800"
                        }`}
                      >
                        {isActive ? "Working" : "Closed"}
                      </span>
                    </div>

                    {isActive ? (
                      <div className="space-y-2">
                        {intervals.map((intv, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded-xl bg-[#020617] border border-slate-800 px-3 py-2"
                          >
                            <Clock className="h-4 w-4 text-[#94A3B8]" />
                            <span className="text-sm text-[#E5E7EB] font-medium">
                              {intv.from} – {intv.to}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#64748B]">
                        No available intervals configured.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </MotionSection>

          {/* Side card */}
          <MotionSection
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="rounded-2xl bg-[#020617] border border-[#1F2937] p-6 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-[#111827] p-3">
                <Settings className="h-5 w-5 text-[#94A3B8]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E5E7EB]">
                  How this schedule is used
                </h3>
                <p className="mt-2 text-sm text-[#94A3B8]">
                  The weekly working schedule defines the base availability. Time-off
                  exceptions are applied on top of these intervals for specific days.
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-[#64748B] space-y-1.5">
              <p>• Changing the schedule affects future appointment slots.</p>
              <p>• Existing booked appointments are not automatically cancelled.</p>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] text-[#E5E7EB] px-4 py-2.5 text-sm hover:bg-[#2F80ED] hover:text-white transition-colors"
            >
              Open editor (UI only)
            </button>
          </MotionSection>
        </div>
      </div>
    </div>
  );
}
