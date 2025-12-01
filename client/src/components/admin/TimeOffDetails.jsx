// src/components/admin/TimeOffDetailsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  Pencil,
  Trash2,
} from "lucide-react";
import timeOffService from "../../services/timeOffService";

export default function TimeOffDetailsPage() {
  const { date } = useParams(); // expected "YYYY-MM-DD"
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true)
  const [timeOffItems, setTimeOffItems] = useState([])

  const [editingItem, setEditingItem] = useState(null)
  const [editValues, setEditValues] = useState({
    dateFrom: '',
    dateTo: '',
    from: '',
    to: '',
    reason: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const prettyDate = useMemo(() => {
      if (!date) return "";
      const [y, m, d] = date.split("-");
      const jsDate = new Date(Number(y), Number(m) - 1, Number(d));
      return jsDate.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
      });
  }, [date]);

  useEffect(() => {
    timeOffService.getAll()
      .then(setTimeOffItems)
      .finally(() => setIsLoading(false))
  }, [])
  
  const partialOffs = timeOffItems.filter(x => (x.dateFrom === date && x.dateTo === date) || (x.dateFrom <= date && x.dateTo >= date)) 
  
  const timeOffDeleteHandler = async (id, dateFrom, dateTo, from, to) => {
    const isFullDay = !from && !to;

    const hasConfirm = isFullDay
      ? confirm(`Victor, are you sure you want to delete time off from ${dateFrom} to ${dateTo}?`)
      : confirm(`Victor, are you sure you want to delete time off for ${dateFrom} from ${from} until ${to}?`);

    if (!hasConfirm) return

    await timeOffService.delete(id)

    navigate('/admin')
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-[#334155] dark:text-[#94A3B8]">
        Loading calendar…
      </div>
    );
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white">
        <main className="mx-auto max-w-4xl px-5 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">
                Time off for{" "}
                {prettyDate || (date ? date : "selected date")}
              </h1>
              <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                All blocks that affect this date. (Static preview for now)
              </p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-4 py-2.5 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
          </div>

          <div className="mx-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />

          {/* List container */}
          <section className="space-y-4">
            {partialOffs.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-[#111827] border border-dashed border-[#E5E7EB] dark:border-[#1F2937] p-6 text-sm text-[#334155] dark:text-[#94A3B8]">
                No time off blocks exist for this date yet.
              </div>
            ) : (
              partialOffs.map((item) => {
                const isFullDay = !item.from && !item.to;

                return (
                  <div
                    key={item._id}
                    className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-4 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-2">
                      {/* Date range */}
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {item.dateFrom === item.dateTo
                            ? item.dateFrom
                            : `${item.dateFrom} → ${item.dateTo}`}
                        </span>
                      </div>

                      {/* Time info */}
                      <div className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#94A3B8]">
                        <Clock className="h-4 w-4" />
                        {isFullDay ? (
                          <span>Full day (09:00 – 17:00)</span>
                        ) : (
                          <span>
                            Partial day: {item.from} – {item.to}
                          </span>
                        )}
                      </div>

                      {/* Reason */}
                      {item.reason && (
                        <div className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#94A3B8]">
                          <Briefcase className="h-4 w-4" />
                          <span>{item.reason}</span>
                        </div>
                      )}
                    </div>

                    {/* Placeholder right side – later: delete/edit buttons */}
                    <div className="flex flex-col gap-2 text-xs">
                      {/* Edit button – later you can turn this into a Link to your edit page */}
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#2F80ED] text-[#2F80ED] px-3 py-1.5 font-semibold hover:bg-[#2F80ED] hover:text-white transition-colors"
                        onClick={() => {
                          setEditingItem(item);
                          setEditValues({
                            dateFrom: item.dateFrom,
                            dateTo: item.dateTo,
                            from: item.from || '',
                            to: item.to || '',
                            reason: item.reason || '',
                          })
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    
                      {/* Delete button – later you’ll wire timeOffService.delete(item._id) */}
                      <button
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-500/70 text-red-600 dark:text-red-300 px-3 py-1.5 font-semibold hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                        onClick={() => timeOffDeleteHandler(item._id, item.dateFrom, item.dateTo, item.from, item.to)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
          {editingItem && (
            <QuickEditForm 
              item={editingItem}
              values={editValues}
              onChange={setEditValues}
              onCancel={() => setEditingItem(null)}
              isSaving={isSaving}
              onSave={async () => {
                try {
                  setIsSaving(true)
                  
                  const res = await timeOffService.update(
                    editValues,
                    editingItem._id,
                  )

                  const updated = res.updatedTimeOff || res;

                  setTimeOffItems((prev) =>
                    prev.map((x) => (x._id === updated._id ? updated : x))
                  )

                  setEditingItem(null)
                } catch (error) {
                  console.error('Failed to update time off:', error);
                } finally {
                  setIsSaving(false)
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

const SLOT_STEP_MIN = 30;

function generateSlotsInRange(start = '09:00', end = '17:00') {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)

  const slots = [];
  let current = sh * 60 + sm;
  let endMin = eh * 60 + em;

  while (current <= endMin) {
    const h = String(Math.floor(current / 60)).padStart(2, '0')
    const m = String(current % 60).padStart(2, '0')

    slots.push(`${h}:${m}`)

    current += SLOT_STEP_MIN;
  }

  return slots;
}

function addMinutesToTimeStr(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + minutes;

  const hh = String(Math.floor(total / 60)).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')

  return `${hh}:${mm}`
}

function buildSlotsFromValues(values) {
  if (!values.from || !values.to) return [];

  const [fh, fm] = values.from.split(':').map(Number)
  const [th, tm] = values.to.split(':').map(Number)

  const slots = [];

  let current = fh * 60 + fm;
  const endMin = th * 60 + tm;
  
  while (current < endMin) {
    const h = String(Math.floor(current / 60)).padStart(2, '0')
    const m = String(current % 60).padStart(2, '0')

    slots.push(`${h}:${m}`)

    current += SLOT_STEP_MIN;
  }

  return slots;
}

/* -------------------------- Quick Edit Form (UI) -------------------------- */
function QuickEditForm({ item, values, onChange, onCancel, onSave, isSaving }) {
  const [selectedSlots, setSelectedSlots] = useState(() =>
    buildSlotsFromValues(values)
  )

  const allSlots = useMemo(
    () => generateSlotsInRange('09:00', '17:00'),
    []
  )

  useEffect(() => {
    setSelectedSlots(buildSlotsFromValues(values))
  }, [values.from, values.to])
  
  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSlotToggle = (slot) => {
    setSelectedSlots((prev) => {
      let next;

      if (prev.includes(slot)) {
        next = prev.filter((s) => s !== slot)
      } else {
        next = [...prev, slot].sort();
      }

      if (next.length === 0) {
        onChange((prevVals) => ({
          ...prevVals,
          from: '',
          to: '',
        }))
      } else {
        const from = next[0];
        const last = next[next.length - 1]
        const to = addMinutesToTimeStr(last, SLOT_STEP_MIN)

        onChange((prevVals) => ({
          ...prevVals,
          from,
          to,
        }))
      }

      return next;
    })
  }

  const isFullDay = !item.from && !item.to;
  const isSingleDay = values.dateFrom === values.dateTo;

  return (
    <section className="mt-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Quick edit</h2>
          <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
            Adjust dates, hours or reason for this time off block.
          </p>
        </div>
        <span className="text-[11px] text-[#64748B] dark:text-[#9CA3AF]">
          Editing ID: <span className="font-mono">{item._id}</span>
        </span>
      </div>

      <div className="mx-0 h-[1px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/50 to-transparent" />

      {/* Date range */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#334155] dark:text-[#E5E7EB]">
            Date from
          </label>
          <input
            type="date"
            className="w-full rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.35]"
            value={values.dateFrom}
            onChange={handleFieldChange("dateFrom")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#334155] dark:text-[#E5E7EB]">
            Date to
          </label>
          <input
            type="date"
            className="w-full rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.35]"
            value={values.dateTo}
            onChange={handleFieldChange("dateTo")}
          />
        </div>
      </div>

      {/* Time range as 30-min slots */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-[#334155] dark:text-[#E5E7EB]">
            Time range (09:00 – 17:00)
          </label>
          <span className="text-[11px] text-[#64748B] dark:text-[#9CA3AF]">
            {isSingleDay
              ? "Click slots to select a range"
              : "Multi-day blocks are treated as full-day; time slots are disabled."}
          </span>
        </div>
      
        {isSingleDay ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {allSlots.map((slot) => {
              const isSelected = selectedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSlotToggle(slot)}
                  className={[
                    "text-xs rounded-xl border px-2 py-1.5 text-center transition-colors",
                    isSelected
                      ? "bg-[#2F80ED] text-white border-[#2F80ED]"
                      : "bg-transparent text-[#334155] dark:text-[#E5E7EB] border-[#E5E7EB] dark:border-[#1F2937] hover:bg-[#F5F7FA] dark:hover:bg-[#020617]",
                  ].join(" ")}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 text-[11px] text-[#64748B] dark:text-[#9CA3AF]">
            For multi-day time off (e.g. {values.dateFrom} → {values.dateTo}), all
            days are treated as full-day blocks. If you want partial hours, convert
            it to a single-day block first.
          </div>
        )}
      </div>


      {/* Reason */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#334155] dark:text-[#E5E7EB]">
          Reason
        </label>
        <input
          type="text"
          className="w-full rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.35] placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280]"
          placeholder="Vacation, court hearing, admin day..."
          value={values.reason}
          onChange={handleFieldChange("reason")}
        />
      </div>

      {/* Info + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
        <p className="text-xs text-[#64748B] dark:text-[#9CA3AF]">
          {isFullDay
            ? "This block is currently treated as a full-day time off. Select slots to convert it to a partial-day block."
            : "This block is a partial-day time off. Clear all slots to turn it into a full-day block."}
        </p>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-1.5 text-xs font-semibold text-[#334155] dark:text-[#E5E7EB] hover:bg-[#F5F7FA] dark:hover:bg-[#020617]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#2F80ED] bg-[#2F80ED] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#266DDE] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </section>
  );
}

