import { motion } from "framer-motion";
import {
  ArrowLeft,
  PencilLine,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  MonitorSmartphone,
  User,
  Hash,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { Link as RRLink, useInRouterContext, useNavigate, useParams } from "react-router";
import { useAppointment, useDeleteAppointment } from "../../api/appointmentApi";
import useAuth from "../../hooks/useAuth";
import { showToast } from "../../utils/toastUtils";

const MotionSection = motion.section;

/**
 * SafeLink — avoids crashes when rendered outside a Router.
 * If Router context is missing, it falls back to a plain <a> tag.
 */
function SafeLink({ to, className, children }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) return <RRLink to={to} className={className}>{children}</RRLink>;
  return <a href={typeof to === "string" ? to : "#"} className={className}>{children}</a>;
}

export default function AppointmentDetails() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { appointment, isLoading } = useAppointment(appointmentId)
  const { deleteAppointment } = useDeleteAppointment()
  const { role, userId } = useAuth()

  if (isLoading || !appointment) {
    return (
      <div className="dark">
        <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
          <main className="flex-1 flex items-center justify-center px-4 py-10">
            <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
              Loading appointment…
            </p>
          </main>
        </div>
      </div>
    );
  }

  const appointmentDeleteClickHandler = async () => {
    const hasConfirm = confirm(`Are you sure you want to delete appointment(${appointmentId}) created by ${appointment.firstName} ${appointment.lastName}`)

    if (!hasConfirm) return;

    await deleteAppointment(appointmentId)

    showToast('Appointment deleted successfully.', 'success');

    navigate('/appointments')
  }

  const isOwner = role === 'Client' && appointment?.creator === userId;  

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">

        {/* Main card */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-5xl rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
          >
            <div className="grid lg:grid-cols-5">
              {/* Details */}
              <div className="lg:col-span-3 p-6 md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-[#334155] dark:text-[#94A3B8]" />
                    <h1 className="text-2xl font-semibold">Appointment #{appointment.id}</h1>
                  </div>

                  <div className="flex items-center gap-2">
                    {role === 'Admin' || isOwner ? (
                      <SafeLink
                        to={`/appointments/${appointment.id}/update`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-2 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.40]"
                        title="Open edit screen"
                      >
                        <PencilLine className="h-4 w-4" /> Edit
                      </SafeLink>
                    ) : ('')}
                    <SafeLink
                      to={-1}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#111827] px-3 py-2 font-semibold text-[#0B1220] dark:text-white border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </SafeLink>
                  </div>
                </div>

                {/* Summary strip */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <SummaryItem icon={<CalendarIcon className="h-4 w-4" />} label="Start (local)" value={fmtDateTime(appointment.startsAt)} />
                  <SummaryItem icon={<Clock className="h-4 w-4" />} label="Duration" value={`${appointment.durationMin} min`} />
                  <SummaryItem icon={<CheckCircle2 className="h-4 w-4" />} label="Status" value={appointment.status} />
                </div>

                {/* Info groups */}
                <div className="mt-6 space-y-6">
                  <InfoCard title="Service & Mode">
                    <InfoRow icon={<User className="h-4 w-4" />} label="Client" value={`${appointment.firstName} ${appointment.lastName}`} />
                    <InfoRow icon={<PencilLine className="h-4 w-4" />} label="Service" value={appointment.service} />
                    <InfoRow
                      icon={appointment.mode === "Online" ? <MonitorSmartphone className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      label="Mode"
                      value={appointment.mode}
                      helper={appointment.mode === "Online" ? "Video call link will be shown after booking." : 'Sofia, bul. Vitosha 25, Floor 3'}
                    />
                    <InfoRow icon={<Clock className="h-4 w-4" />} label="Timezone" value='Europe/Sofia' />
                  </InfoCard>

                  <InfoCard title="Notes">
                    <p className="text-sm text-[#0B1220] dark:text-white/90 whitespace-pre-line">{appointment.notes || "—"}</p>
                  </InfoCard>

                  { role === 'Admin' && (
                    <button
                      onClick={appointmentDeleteClickHandler}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ed2f2f] px-20 py-2 font-semibold text-white hover:bg-[#ffffff] hover:text-red-500 focus:outline-none focus:ring-4 focus:ring-[rgb(47,128,237)/0.40]"
                      title="Open edit screen"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  )}
                </div>

                <p className="mt-6 text-xs text-[#334155] dark:text-[#94A3B8]">
                  Actual data should be loaded by ID and status enforced according to your policy.
                </p>
              </div>

              {/* Side panel */}
              <aside className="lg:col-span-2 hidden lg:block relative overflow-hidden bg-[#0E1726] text-white">
                {/* Soft glow background (same style, tuned for dark panel) */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#2F80ED]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
              
                {/* Optional subtle texture (very light) */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_25%_20%,#ffffff_0%,transparent_40%),radial-gradient(circle_at_85%_0%,#2F80ED_0%,transparent_45%),radial-gradient(circle_at_20%_90%,#7C3AED_0%,transparent_50%)]" />
              
                <div className="relative h-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold relative pb-2">Overview</h2>
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
              
                    <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                      <li>Times are shown in Europe/Sofia.</li>
                      <li>Duration range: 15-480 minutes.</li>
                      <li>Reminders go at T-24h and T-1h.</li>
                    </ul>
                  </div>
              
                  <div className="space-y-2 text-xs text-white/70">
                    <p>Cancel restrictions may apply in the last 24h.</p>
                    <p>Rescheduling may require admin approval.</p>
                  </div>
                </div>
              </aside>
            </div>
          </MotionSection>
        </main>

        <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
          © {new Date().getFullYear()} LexSchedule. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

/* ----------------------- helpers & subcomponents ----------------------- */
function fmtDateTime(isoLocal) {
  try {
    if (!isoLocal) return "—";
    const dt = new Date(isoLocal);
    if (Number.isNaN(dt.getTime())) return isoLocal; // show raw if parse fails
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return isoLocal || "—";
  }
}

function SummaryItem({ icon, label, value }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937]
                 bg-white/60 dark:bg-[#0F1117]/50 px-4 py-3 shadow-sm"
    >
      {/* Soft glow background (same style) */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[#2F80ED]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-[#334155] dark:text-[#94A3B8] text-xs">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20">
            {icon}
          </span>
          <span className="uppercase tracking-wide">{label}</span>
        </div>

        <div className="mt-1 text-sm font-semibold text-[#0B1220] dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937]
                 bg-white/60 dark:bg-[#0F1117]/50 p-4 sm:p-5 shadow-sm"
    >
      {/* Soft glow background (same style) */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#2F80ED]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="h-6 w-6 rounded-xl bg-[#2F80ED]/10 ring-1 ring-[#2F80ED]/20" />
        </div>

        <div className="grid gap-3">{children}</div>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value, helper }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#334155] dark:text-[#94A3B8]">{icon}</span>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm opacity-90">{value ?? "—"}</div>
        {helper ? <div className="text-xs text-[#334155] dark:text-[#94A3B8] mt-0.5">{helper}</div> : null}
      </div>
    </div>
  );
}
