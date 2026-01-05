/* eslint-disable no-unused-vars */
import { useMemo } from "react";
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
  CalendarCheck,
  LayoutDashboard,
  MessageCircle
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

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
      className={[
        "relative overflow-hidden",
        "rounded-2xl bg-white dark:bg-[#111827]",
        "border border-[#E5E7EB] dark:border-[#1F2937]",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      {/* Global glow background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2F80ED]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Content */}
      <div className="relative">
        {children}
      </div>
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

function InfoTile({ icon: Icon, title, text, href }) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href
        ? { href }
        : {})}
      className={[
        "block rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937]",
        "bg-[#F5F7FA] dark:bg-[#0E1726] p-4",
        href
          ? "cursor-pointer hover:border-[#2F80ED]/40 hover:bg-[#F0F6FF] dark:hover:bg-[#111827] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/20 transition-colors"
          : "",
      ].join(" ")}
    >
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
    </Wrapper>
  );
}

function AvatarInitials({ name }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="h-16 w-16 rounded-2xl bg-[#2F80ED]/10 border border-[#2F80ED]/25 flex items-center justify-center">
      <span className="text-lg font-bold text-[#2F80ED]">{initials || "U"}</span>
    </div>
  );
}

/** ✅ Real page component (route this in your app) */
export default function AboutMePage() {
  const { role } = useAuth()

  const content = useMemo(
    () => ({
      firstName: "Victor",
      lastName: "Todorov",
      role: "Admin",
      team: "Scheduling & Client Intake",
      sessions: "Secure sessions",
      email: "vic@abv.bg",
      phone: "+359 88 911 6617",
      location: "Vasil Levski Blvd, Sofia Center, Bulgaria",
      intro: "This system supports the day-to-day work of a legal practice by handling appointments, availability, and client notifications in a structured and dependable way.\nIt is built to reflect how a law office actually operates: with precision, consistency, and respect for clients’ time.",
      principles: [
        "Clear actions, fewer clicks",
        "Predictable statuses (pending / confirmed / canceled)",
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
                  to={-1}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2 hover:bg-[#F5F7FA] dark:hover:bg-[#0E1726]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>

                <h1 className="text-2xl md:text-3xl font-semibold">About me</h1>
              </div>

              <p className="mt-2 text-sm text-[#334155] dark:text-[#94A3B8]">
                Admin-facing overview + shortcuts for the team.
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
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                  {content.sessions}
                </Badge>

              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {role === 'Admin' ? (
                <div>
                  <PrimaryBlueButton to="/admin">
                    <User className="h-4 w-4" />
                    Open dashboard
                  </PrimaryBlueButton>
                </div>
              ) : (
                <div>
                  <PrimaryBlueButton to="/client">
                    <User className="h-4 w-4" />
                    Open dashboard
                  </PrimaryBlueButton>
                </div>
              )}
              <OutlineBlueLink to="/schedule">
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
                <h3 className="text-lg font-semibold">Who I am?</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Quick context for new team members.
                </p>
              </div>
              <OutlineBlueLink to="/profile">
                View My profile <ChevronRight className="h-4 w-4" />
              </OutlineBlueLink>
            </div>

            <GradientDivider />

            <div className="p-5">
              <div className="flex items-start gap-4">
                <AvatarInitials name={content.firstName}/>

                <div className="min-w-0 flex-1">
                  <div className="text-xl font-semibold">{content.firstName} {content.lastName}</div>
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
                    href={`mailto:${content.email}`}
                    text={content.email}
                  />
                  <InfoTile
                    icon={Phone}
                    title="Phone"
                    href="tel:+359889116617"
                    text={content.phone}
                  />
                  <InfoTile
                    icon={MapPin}
                    title="Location"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(content.location)}`}
                    text={content.location}
                  />
                  <InfoTile
                    icon={MessageCircle}
                    title="Viber"
                    href="viber://chat?number=%2B359889116617"
                    text='Chat on Viber'
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
                    title="Appointments & availability"
                    text="Coordinating client appointments and managing office availability."
                  />
                  <InfoTile
                    icon={Mail}
                    title="Client communication"
                    text="Ensuring timely and accurate communication with clients regarding appointments."
                  />
                  <InfoTile
                    icon={Briefcase}
                    title="Daily practice support"
                    text="Supporting the efficient day-to-day operation of the legal practice."
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
                      I have left contacts above.
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
          className="lg:col-span-1 space-y-6"
        >
          <Card>
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Consultation guidelines</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Quick expectations for a smooth visit.
                </p>
              </div>
              <Badge tone="blue">Office</Badge>
            </div>
        
            <GradientDivider />
        
            <div className="p-4 space-y-3">
              {/* 1 */}
              <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] p-4">
                <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
                  Before your visit
                </div>
                <ul className="mt-2 space-y-2 text-sm text-[#334155] dark:text-[#94A3B8]">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                    Bring all relevant documents (contracts, court papers, correspondence).
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                    Prepare a short timeline of key dates and events.
                  </li>
                </ul>
              </div>
        
              {/* 2 */}
              <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] p-4">
                <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
                  Appointment rules
                </div>
                <ul className="mt-2 space-y-2 text-sm text-[#334155] dark:text-[#94A3B8]">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                    Consultations are by appointment only.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                    If you need to reschedule, please do so in advance.
                  </li>
                </ul>
              </div>
        
              {/* 3 */}
              <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] p-4">
                <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
                  Response time
                </div>
                <div className="mt-2 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                  Messages are typically answered during business hours. For urgent matters,
                  please call or chat me.
                </div>
              </div>
            </div>
        
            <div className="px-4 pb-4">
              <div className="rounded-2xl border border-[#2F80ED]/25 bg-[#2F80ED]/10 p-4">
                <div className="text-xs font-medium text-[#2F80ED]">
                  Confidentiality
                </div>
                <div className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                  Information shared during a consultation is handled with professional
                  discretion and in accordance with legal confidentiality standards.
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Story & experience
                </div>
                <div className="mt-1 text-lg font-semibold">Professional background</div>
              </div>
              <Badge tone="blue">Lawyer</Badge>
            </div>
        
            <div className="mt-4">
              <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0E1726] p-4">
                <div className="text-sm font-semibold text-[#0B1220] dark:text-white">
                  A brief story
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#334155] dark:text-[#94A3B8]">
                  With a long-standing interest in justice and practical problem-solving,
                  he pursued law with the goal of helping people navigate complex situations
                  with clarity and confidence. Over the years, his work has focused on
                  careful preparation, professional discretion, and reliable communication
                  — values that remain central to the practice today.
                </p>
              </div>
        
              {/* Timeline */}
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="mt-1 h-10 w-10 rounded-2xl border border-[#2F80ED]/25 bg-[#2F80ED]/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#2F80ED]">1</span>
                  </div>
                  <div className="flex-1 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[#0B1220] dark:text-white">
                        Legal education
                      </div>
                      <span className="text-xs font-semibold text-[#334155] dark:text-[#94A3B8]">
                        (Year)
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                      Completed legal studies and began training with a focus on practical
                      legal work and client-centered communication.
                    </div>
                  </div>
                </div>
        
                <div className="flex gap-3">
                  <div className="mt-1 h-10 w-10 rounded-2xl border border-[#2F80ED]/25 bg-[#2F80ED]/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#2F80ED]">2</span>
                  </div>
                  <div className="flex-1 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[#0B1220] dark:text-white">
                        Early practice & specialization
                      </div>
                      <span className="text-xs font-semibold text-[#334155] dark:text-[#94A3B8]">
                        (Year–Year)
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                      Built experience across real cases and developed a focused practice
                      in areas where clients most often need clear guidance and strong representation.
                    </div>
                  </div>
                </div>
        
                <div className="flex gap-3">
                  <div className="mt-1 h-10 w-10 rounded-2xl border border-[#2F80ED]/25 bg-[#2F80ED]/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#2F80ED]">3</span>
                  </div>
                  <div className="flex-1 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[#0B1220] dark:text-white">
                        Today
                      </div>
                      <span className="text-xs font-semibold text-[#334155] dark:text-[#94A3B8]">
                        Present
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                      Provides consultations and representation with a focus on careful preparation,
                      practical solutions, and professional discretion.
                    </div>
                  </div>
                </div>
              </div>
        
              {/* Achievements */}
              <div className="mt-4 rounded-2xl border border-[#2F80ED]/25 bg-[#2F80ED]/10 p-4">
                <div className="text-sm font-semibold text-[#0B1220] dark:text-white">
                  Highlights
                </div>
                <ul className="mt-2 space-y-2 text-sm text-[#334155] dark:text-[#94A3B8]">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                    Years of consistent legal practice and client representation.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                    Known for clear communication and careful case preparation.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2F80ED]" />
                    Focused on practical outcomes and professional discretion.
                  </li>
                </ul>
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
