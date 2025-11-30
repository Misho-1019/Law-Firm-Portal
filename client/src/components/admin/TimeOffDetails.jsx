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
  const [isLoading, setIsLoading] = useState(true)
  const [timeOffItems, setTimeOffItems] = useState([])
  const navigate = useNavigate();

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

  const timeOffDeleteHandler = async (id, dateFrom, dateTo, from, to) => {
    let hasConfirm;

    if (from === undefined || to === undefined) {
        hasConfirm = confirm(`Victor, are you sure you want to delete time off from ${dateFrom} to ${dateTo}?`)
    }
    else {
        hasConfirm = confirm(`Victor, are you sure you want to delete time off for ${dateFrom} from ${from} until ${to}`)
    }

    if (!hasConfirm) return;

    await timeOffService.delete(id)
    
    navigate('/admin')
  }

  const partialOffs = timeOffItems.filter(x => (x.dateFrom === date && x.dateTo === date) || (x.dateFrom <= date && x.dateTo >= date)) 

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
                      <Link
                        type="button"
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#2F80ED] text-[#2F80ED] px-3 py-1.5 font-semibold hover:bg-[#2F80ED] hover:text-white transition-colors"
                        // onClick={() => {/* navigate to edit page later */}}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                    
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
        </main>
      </div>
    </div>
  );
}
