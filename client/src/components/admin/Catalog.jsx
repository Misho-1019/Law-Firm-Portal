/* UI-only, palette-matched (no functionality) */
import { Calendar as CalendarIcon, ListFilter, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import appointmentsService from "../../services/appointmentsService";
import ItemCatalog from "./item/ItemCatalog";

export default function Catalog() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    appointmentsService.getAll()
        .then(setAppointments)
        .finally(setIsLoading(false))
  }, [])

  const allAppointments = appointments[0] || [];
  
  if (isLoading) {
    return (
      <div className="p-6 text-sm text-[#334155] dark:text-[#94A3B8]">
        Loading appointments…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#334155] dark:text-[#94A3B8]" />
            <h1 className="text-xl font-semibold text-[#334155] dark:text-[#94A3B8]">
              All Appointments
            </h1>
          </div>

          {/* Filter bar (static/disabled) */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
              <select
                disabled
                className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
                defaultValue=""
              >
                <option value="">All statuses</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <input
                disabled
                placeholder="Filter by clientId"
                className="w-56 rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] placeholder-slate-400 opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              />
            </div>

            <select
              disabled
              className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              defaultValue="startsAt:asc"
            >
              <option value="startsAt:asc">Start time ↑</option>
              <option value="startsAt:desc">Start time ↓</option>
              <option value="createdAt:desc">Newest created</option>
              <option value="createdAt:asc">Oldest created</option>
            </select>

            <select
              disabled
              className="rounded-xl border border-slate-200/40 bg-slate-100/40 px-3 py-2 text-sm text-[#334155] opacity-60 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-[#94A3B8]"
              defaultValue={20}
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        {/* Content container */}
        <div className="space-y-4">
          {/* Loading (example) */}
          <div className="flex items-center justify-center rounded-2xl border border-slate-200/40 bg-slate-100/40 p-12 text-sm text-[#334155] dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-[#94A3B8]">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading appointments…
          </div>
         
          {allAppointments.length > 0 ? (
            <ItemCatalog appointments={allAppointments}/>
          ) : (
            <h3 className="text-center text-lg font-medium mt-2 text-[#334155] dark:text-[#94A3B8]">
            No appointments yet
          </h3>
          )}

          {/* Pagination (static/disabled) */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] opacity-50 dark:border-slate-800/60 dark:text-[#94A3B8]"
            >
              Prev
            </button>
            <span className="text-sm text-[#334155] dark:text-[#94A3B8]">
              Page 1 / 5
            </span>
            <button
              className="rounded-xl border border-slate-200/40 px-3 py-2 text-sm text-[#334155] opacity-50 dark:border-slate-800/60 dark:text-[#94A3B8]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
