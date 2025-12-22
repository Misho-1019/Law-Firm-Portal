import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Activity,
  Users,
  ChevronRight,
  Sparkles,
  Eye,
} from "lucide-react";

const MotionDiv = motion.div;
const MotionSection = motion.section;

function GradientDivider() {
  return (
    <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm " +
        className
      }
    >
      {children}
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral:
      "border-[#E5E7EB] dark:border-[#1F2937] bg-white/70 dark:bg-[#0E1726] text-[#0B1220] dark:text-white",
    blue:
      "border-[#2F80ED]/40 bg-[#2F80ED]/10 text-[#2F80ED] dark:border-[#2F80ED]/40 dark:bg-[#2F80ED]/10 dark:text-[#93C5FD]",
  };

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold " +
        tones[tone]
      }
    >
      {children}
    </span>
  );
}

function OutlineBlueLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5 border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors"
    >
      {children}
    </Link>
  );
}

function PrimaryBlueButton({ to, children }) {
  return (
    <Link
      to={to}
      className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
    >
      {children}
      <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />
    </Link>
  );
}

function QuickLinkRow({ icon: Icon, label, to, hint }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] px-4 py-3 hover:bg-white dark:hover:bg-[#111827] transition-colors"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] bg-white/70 dark:bg-[#111827] group-hover:border-[#2F80ED]/40">
          <Icon className="h-4 w-4 text-[#334155] dark:text-[#94A3B8] group-hover:text-[#2F80ED]" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[#0B1220] dark:text-white">
            {label}
          </span>
          {hint ? (
            <span className="block text-xs text-[#334155] dark:text-[#94A3B8]">
              {hint}
            </span>
          ) : null}
        </span>
      </span>

      <ChevronRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#2F80ED]" />
    </Link>
  );
}

function InfoTile({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2F80ED]/25 bg-[#2F80ED]/10">
          <Icon className="h-5 w-5 text-[#2F80ED]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-[#0B1220] dark:text-white">
            {title}
          </div>
          <div className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

/** ✅ Real page component (route this in your app) */
export function AboutMePage() {
  const content = useMemo(
    () => ({
      name: "Icko",
      role: "Admin",
      team: "Scheduling & Client Intake",
      email: "icko@example.com",
      phone: "+359 88 123 4567",
      location: "Sofia, Bulgaria",
      intro:
        "I run the scheduling workflow so the team sees one clean source of truth: working hours, time off, free slots, and appointments — consistent across admin and client views.",
      principles: [
        "Clear actions, fewer clicks",
        "Predictable states (pending / approved / canceled)",
        "Palette consistency in light + dark",
      ],
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
      {/* Hero / header (match your dashboard style) */}
      <section className="bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>

                <h1 className="text-2xl md:text-3xl font-semibold">About me</h1>
              </div>

              <p className="mt-2 text-sm text-[#334155] dark:text-[#94A3B8]">
                Admin-facing overview + shortcuts for the team. Same blue accents
                as the dashboard.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="blue">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                  {content.role}
                </Badge>
                <Badge>
                  <Briefcase className="mr-2 h-3.5 w-3.5" />
                  {content.team}
                </Badge>
                <Badge tone="blue">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  UI-first
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <PrimaryBlueButton to="/profile">
                <User className="h-4 w-4" />
                Open profile
              </PrimaryBlueButton>
              <OutlineBlueLink to="/admin/schedule">
                Go to schedule <ChevronRight className="h-4 w-4" />
              </OutlineBlueLink>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-5 py-8 grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <MotionSection
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Main narrative card */}
          <Card>
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Who I am</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Quick context for new team members.
                </p>
              </div>
              <OutlineBlueLink to="/profile">
                View profile <ChevronRight className="h-4 w-4" />
              </OutlineBlueLink>
            </div>

            <GradientDivider />

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#2F80ED]/10 border border-[#2F80ED]/25 flex items-center justify-center">
                  <User className="h-6 w-6 text-[#2F80ED]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xl font-semibold">{content.name}</div>
                  <div className="mt-2 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                    {content.intro}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {content.principles.map((p) => (
                      <Badge key={p} tone="blue">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tiles row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MotionDiv
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                      Contact
                    </div>
                    <div className="mt-1 text-lg font-semibold">Reach me fast</div>
                  </div>
                  <Badge tone="blue">Internal</Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <InfoTile
                    icon={Mail}
                    title="Email"
                    text={content.email}
                  />
                  <InfoTile
                    icon={Phone}
                    title="Phone"
                    text={content.phone}
                  />
                  <InfoTile
                    icon={MapPin}
                    title="Location"
                    text={content.location}
                  />
                </div>
              </Card>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                      Responsibilities
                    </div>
                    <div className="mt-1 text-lg font-semibold">What I handle</div>
                  </div>
                  <Badge tone="blue">Admin</Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <InfoTile
                    icon={Calendar}
                    title="Availability logic"
                    text="Working hours, time off, and free slots."
                  />
                  <InfoTile
                    icon={Users}
                    title="Client intake flow"
                    text="Keep the timeline consistent for staff and clients."
                  />
                  <InfoTile
                    icon={Settings}
                    title="System hygiene"
                    text="Clear statuses, tidy UI, fewer edge cases."
                  />
                </div>
              </Card>
            </MotionDiv>
          </div>

          {/* Blue callout */}
          <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <Card className="overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-[#2F80ED]/12 via-transparent to-transparent">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2F80ED]/25 bg-[#2F80ED]/10">
                    <Activity className="h-5 w-5 text-[#2F80ED]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[#0B1220] dark:text-white">
                      How to report issues
                    </div>
                    <div className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                      If something looks wrong (slots missing, overlaps, weird statuses),
                      screenshot the page + include the date and client name, then send it to me.
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone="blue">Date (YYYY-MM-DD)</Badge>
                      <Badge tone="blue">Client</Badge>
                      <Badge tone="blue">Status</Badge>
                      <Badge tone="blue">Screenshot</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </MotionDiv>
        </MotionSection>

        {/* Right column: Quick links */}
        <MotionSection
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:col-span-1"
        >
          <Card>
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Quick links</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Shortcuts for the team.
                </p>
              </div>
              <Badge tone="blue">Admin</Badge>
            </div>

            <GradientDivider />

            <div className="p-4 space-y-2">
              <QuickLinkRow
                icon={Calendar}
                label="Admin schedule"
                hint="Working hours & availability"
                to="/admin/schedule"
              />
              <QuickLinkRow
                icon={Settings}
                label="Scheduler settings"
                hint="Defaults and constraints"
                to="/admin/schedule"
              />
              <QuickLinkRow
                icon={Users}
                label="Appointments"
                hint="View and manage timeline"
                to="/appointments"
              />
              <QuickLinkRow
                icon={Activity}
                label="System status"
                hint="Health and diagnostics"
                to="/admin/system"
              />
            </div>

            <div className="px-4 pb-4">
              <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] p-4">
                <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
                  Tip
                </div>
                <div className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                  If you want, this area can show app version, environment, and a
                  “contact admin” action.
                </div>
              </div>
            </div>
          </Card>
        </MotionSection>
      </main>

      <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
        © {new Date().getFullYear()} LexSchedule. All rights reserved.
      </footer>
    </div>
  );
}

/** ✅ Preview in chat: default export with light/dark toggle */
export default function AboutMePreview() {
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center gap-2">
        <button
          onClick={() => setDark((s) => !s)}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
        >
          <Eye className="h-4 w-4" />
          Toggle {dark ? "Light" : "Dark"}
        </button>

        <OutlineBlueLink to="/profile">
          Profile <ChevronRight className="h-4 w-4" />
        </OutlineBlueLink>
      </div>

      <AboutMePage />
    </div>
  );
}

/**
 * ✅ When moving into your real app as src/pages/AboutMePage.jsx:
 * - change the bottom to: `export default AboutMePage;`
 * - remove AboutMePreview if you don’t want the toggle
 */
