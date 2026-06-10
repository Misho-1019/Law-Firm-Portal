import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ArrowLeft, Save, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useSchedule, useUpdateSchedule } from "../../api/scheduleApi";
import Skeleton from "../Skeleton";
import { showToast } from "../../utils/toastUtils";

const MotionSection = motion.section;

const WEEKDAYS = [
  { idx: 0, label: "Sunday" },
  { idx: 1, label: "Monday" },
  { idx: 2, label: "Tuesday" },
  { idx: 3, label: "Wednesday" },
  { idx: 4, label: "Thursday" },
  { idx: 5, label: "Friday" },
  { idx: 6, label: "Saturday" },
];

const DEFAULT_INTERVAL = { from: "09:00", to: "17:00" };

function buildDefaults() {
  return {
    tz: "Europe/Sofia",
    days: WEEKDAYS.map((d) => ({
      weekday: d.idx,
      active: d.idx >= 1 && d.idx <= 5,
      intervals: d.idx >= 1 && d.idx <= 5 ? [{ ...DEFAULT_INTERVAL }] : [],
    })),
  };
}

export default function ScheduleEditor() {
  const navigate = useNavigate();
  const { scheduleData, isLoading } = useSchedule();
  const { update, isSaving } = useUpdateSchedule();

  const [tz, setTz] = useState("Europe/Sofia");
  const [days, setDays] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isLoading || initialized) return;

    if (scheduleData && scheduleData.days) {
      const existing = scheduleData.days;
      const merged = WEEKDAYS.map((d) => {
        const found = existing.find((x) => x.weekday === d.idx);
        return {
          weekday: d.idx,
          active: found ? true : d.idx >= 1 && d.idx <= 5,
          intervals: found?.intervals?.length
            ? found.intervals.map((i) => ({ from: i.from, to: i.to }))
            : d.idx >= 1 && d.idx <= 5
            ? [{ ...DEFAULT_INTERVAL }]
            : [],
        };
      });
      setTz(scheduleData.tz || "Europe/Sofia");
      setDays(merged);
    } else {
      const defaults = buildDefaults();
      setTz(defaults.tz);
      setDays(defaults.days);
    }
    setInitialized(true);
  }, [scheduleData, isLoading, initialized]);

  function toggleDay(weekday) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === weekday
          ? {
              ...d,
              active: !d.active,
              intervals: !d.active && d.intervals.length === 0 ? [{ ...DEFAULT_INTERVAL }] : d.intervals,
            }
          : d
      )
    );
  }

  function updateInterval(weekday, idx, field, value) {
    setDays((prev) =>
      prev.map((d) => {
        if (d.weekday !== weekday) return d;
        const intervals = [...d.intervals];
        intervals[idx] = { ...intervals[idx], [field]: value };
        return { ...d, intervals };
      })
    );
  }

  function addInterval(weekday) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === weekday
          ? { ...d, intervals: [...d.intervals, { ...DEFAULT_INTERVAL }], active: true }
          : d
      )
    );
  }

  function removeInterval(weekday, idx) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === weekday ? { ...d, intervals: d.intervals.filter((_, i) => i !== idx) } : d
      )
    );
  }

  async function handleSave() {
    const payload = {
      tz,
      days: days
        .filter((d) => d.active && d.intervals.length > 0)
        .map((d) => ({
          weekday: d.weekday,
          intervals: d.intervals.map((i) => ({ from: i.from, to: i.to })),
        })),
    };

    if (payload.days.length === 0) {
      showToast("At least one active day with intervals is required.", "warning");
      return;
    }

    try {
      await update(payload);
      showToast("Schedule saved successfully!", "success");
    } catch {
      showToast("Failed to save schedule.", "error");
    }
  }

  function handleReset() {
    if (scheduleData && scheduleData.days) {
      const existing = scheduleData.days;
      setTz(scheduleData.tz || "Europe/Sofia");
      setDays(
        WEEKDAYS.map((d) => {
          const found = existing.find((x) => x.weekday === d.idx);
          return {
            weekday: d.idx,
            active: !!found,
            intervals: found?.intervals?.length
              ? found.intervals.map((i) => ({ from: i.from, to: i.to }))
              : [],
          };
        })
      );
    } else {
      const defaults = buildDefaults();
      setTz(defaults.tz);
      setDays(defaults.days);
    }
    showToast("Changes discarded.", "info");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="rounded-2xl bg-[#020617] border border-[#1F2937] p-6 space-y-4">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-[#E5E7EB]" />
            <div>
              <h1 className="text-2xl font-semibold text-[#E5E7EB]">Edit Working Schedule</h1>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Define weekly working hours; these will be used to generate available slots.
              </p>
            </div>
          </div>

          <Link
            to="/schedule"
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
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                className="rounded-xl border border-slate-700 bg-[#020617] px-3 py-2 text-sm text-[#E5E7EB]"
              >
                <option value="Europe/Sofia">Europe/Sofia</option>
                <option value="Europe/Rome">Europe/Rome</option>
                <option value="Europe/Berlin">Europe/Berlin</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-slate-800/60" />

          <div className="space-y-4">
            {days.map((day) => (
              <div
                key={day.weekday}
                className="rounded-2xl border border-slate-800 bg-[#020617] px-4 py-4 sm:px-5 sm:py-4 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#0F172A] flex items-center justify-center border border-[#1F2937]">
                      <span className="text-sm font-semibold text-[#E5E7EB]">
                        {WEEKDAYS[day.weekday].label.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#E5E7EB]">
                        {WEEKDAYS[day.weekday].label}
                      </div>
                      <div className="text-xs text-[#94A3B8]">
                        Define one or more working intervals
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-[#94A3B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.active}
                        onChange={() => toggleDay(day.weekday)}
                        className="h-4 w-4 rounded border border-slate-700 bg-transparent"
                      />
                      Active day
                    </label>
                  </div>
                </div>

                {day.active && (
                  <div className="space-y-3">
                    {day.intervals.map((interval, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[repeat(2,minmax(0,1fr))_auto] gap-3 sm:max-w-md"
                      >
                        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#020617] px-3 py-2">
                          <Clock className="h-4 w-4 text-[#94A3B8]" />
                          <input
                            type="time"
                            value={interval.from}
                            onChange={(e) => updateInterval(day.weekday, idx, "from", e.target.value)}
                            className="w-full bg-transparent text-sm text-[#E5E7EB] outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#020617] px-3 py-2">
                          <Clock className="h-4 w-4 text-[#94A3B8]" />
                          <input
                            type="time"
                            value={interval.to}
                            onChange={(e) => updateInterval(day.weekday, idx, "to", e.target.value)}
                            className="w-full bg-transparent text-sm text-[#E5E7EB] outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInterval(day.weekday, idx)}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] px-3 py-2 text-sm text-[#94A3B8] hover:text-red-400 hover:border-red-800"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addInterval(day.weekday)}
                      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-700 px-3 py-2 text-sm text-[#94A3B8] hover:text-[#E5E7EB]"
                    >
                      <Plus className="h-4 w-4" />
                      Add interval
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
            <p className="text-sm text-[#94A3B8]">
              Changes take effect immediately for future slot calculations.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1F2937] px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#020617] disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2F80ED] bg-[#2F80ED] px-5 py-2 text-sm text-white hover:bg-[#1D64C1] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save schedule"}
              </button>
            </div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
}
