// src/components/admin/schedule/ScheduleEditor.jsx
/* UI-only, palette-matched (no functionality) */
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const MotionSection = motion.section;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleEditor() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-[#E5E7EB]" />
            <div>
              <h1 className="text-2xl font-semibold text-[#E5E7EB]">
                Edit Working Schedule
              </h1>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Define weekly working hours; these will be used to generate available slots.
              </p>
            </div>
          </div>

          <Link
            to='/schedule'
            className="inline-flex items-center gap-2 rounded-2xl border border-[#1F2937] px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#020617]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </Link>
        </div>

        <MotionSection
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl bg-[#020617] border border-[#1F2937] shadow-sm p-6 space-y-6"
        >
          {/* Timezone */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#E5E7EB]">Timezone & defaults</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                The timezone is applied to all intervals and appointment times.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-[#94A3B8]">Timezone</label>
              <select
                className="rounded-xl border border-slate-700 bg-[#020617] px-3 py-2 text-sm text-[#E5E7EB]"
                defaultValue="Europe/Sofia"
              >
                <option value="Europe/Sofia">Europe/Sofia</option>
                <option value="Europe/Rome">Europe/Rome</option>
                <option value="Europe/Berlin">Europe/Berlin</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-slate-800/60" />

          {/* Week rows */}
          <div className="space-y-4">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className="rounded-2xl border border-slate-800 bg-[#020617] px-4 py-4 sm:px-5 sm:py-4 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#0F172A] flex items-center justify-center border border-[#1F2937]">
                      <span className="text-sm font-semibold text-[#E5E7EB]">
                        {day.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#E5E7EB]">{day}</div>
                      <div className="text-xs text-[#94A3B8]">
                        Define one or more working intervals
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-[#94A3B8]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border border-slate-700 bg-transparent"
                        defaultChecked={idx >= 1 && idx <= 5}
                      />
                      Active day
                    </label>
                  </div>
                </div>

                {/* Intervals (UI-only) */}
                <div className="space-y-3">
                  <div className="grid grid-cols-[repeat(2,minmax(0,1fr))_auto] gap-3 sm:max-w-md">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#020617] px-3 py-2">
                      <Clock className="h-4 w-4 text-[#94A3B8]" />
                      <input
                        type="time"
                        defaultValue="09:00"
                        className="w-full bg-transparent text-sm text-[#E5E7EB] outline-none"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#020617] px-3 py-2">
                      <Clock className="h-4 w-4 text-[#94A3B8]" />
                      <input
                        type="time"
                        defaultValue={idx === 4 || idx === 5 ? "14:00" : "17:00"}
                        className="w-full bg-transparent text-sm text-[#E5E7EB] outline-none"
                        readOnly
                      />
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] px-3 py-2 text-sm text-[#94A3B8]"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-700 px-3 py-2 text-sm text-[#94A3B8]"
                  >
                    <Plus className="h-4 w-4" />
                    Add interval
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
            <p className="text-sm text-[#94A3B8]">
              Changes here are not persisted yet – this page is UI-only for now.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-[#1F2937] px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#020617]"
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-[#2F80ED] bg-[#2F80ED] px-5 py-2 text-sm text-white hover:bg-[#1D64C1]"
              >
                Save schedule (UI only)
              </button>
            </div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
}
