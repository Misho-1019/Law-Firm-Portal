/* eslint-disable no-unused-vars */
// src/components/admin/TimeOffDetailsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
} from "lucide-react";
import timeOffService from "../../services/timeOffService";

export default function TimeOffDetailsPage() {
  const { date } = useParams(); // expected "YYYY-MM-DD"
  const [isLoading, setIsLoading] = useState(true)
  const [timeOffItems, setTimeOffItems] = useState([])

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
                    <div className="text-[11px] text-[#64748B] dark:text-[#9CA3AF] italic">
                      Actions (edit / delete) will go here later.
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
