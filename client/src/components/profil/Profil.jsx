/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  ShieldCheck,
  Briefcase,
  Globe,
  PencilLine,
  Camera,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import ChangePasswordForm from "./password/Password";

const MotionDiv = motion.div;
const MotionSection = motion.section;

function GradientDivider() {
  return (
    <div className="mx-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED]/60 to-transparent" />
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

function Card({ children, className = "", ...props }) {
  return (
    <div
      {...props}
      className={
        "rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm " +
        className
      }
    >
      {children}
    </div>
  );
}

function PrimaryLinkButton({ to, children }) {
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

function FieldRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#94A3B8]">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-[#0B1220] dark:text-white break-words text-right">
        {value}
      </div>
    </div>
  );
}

function FieldRowLink({ icon: Icon, label, href, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#94A3B8]">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{label}</span>
      </div>

      <a
        href={href}
        className="
          text-sm font-semibold text-[#0B1220] dark:text-white break-words text-right
          hover:text-[#2F80ED] dark:hover:text-[#60A5FA]
          focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/20 rounded-lg px-1 -mx-1
          transition-colors
        "
      >
        {value}
      </a>
    </div>
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


/** ✅ UI-only Profile page (no editing, no state) */
export default function ProfilePage() {
  const { role, email, firstName, lastName, phone } = useAuth();

  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const data = useMemo(
    () => ({
      department: "Scheduling & Client Intake",
      location: "Vasil Levski Blvd, Sofia Center, Bulgaria",
      languages: ["Bulgarian", "English"],
      bio:
        "I keep the scheduling system clean and predictable — working hours, time-off, free slots, and appointments all in one consistent timeline.",
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
      {/* Header / hero */}
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

                <h1 className="text-2xl md:text-3xl font-semibold">Profile</h1>
              </div>

              <p className="mt-2 text-sm text-[#334155] dark:text-[#94A3B8]">
                Personal details, role and preferences.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="blue">
                  {role === 'Admin' ? (
                    <div className="flex flex-wrap gap-0">
                      <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                      {role}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-0">
                      <User className="mr-2 h-3.5 w-3.5" />
                      {role}
                    </div>
                  )}
                </Badge>
                <Badge>
                  <Briefcase className="mr-2 h-3.5 w-3.5" />
                  {data.department}
                </Badge>
              </div>
            </div>

            {/* UI-only actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-1 rounded-xl text-[#2F80ED] hover:text-white px-3 py-1.5 border border-[#2F80ED] hover:bg-[#2F80ED] transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                Security <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-5 py-8 grid gap-6 lg:grid-cols-3">
        {/* Left card: avatar + bio */}
        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-1"
        >
          <Card>
            <div className="p-5 flex items-start gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-[#2F80ED]/10 border border-[#2F80ED]/25 flex items-center justify-center">
                  <AvatarInitials name={firstName} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold truncate">
                  {firstName} {lastName}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.languages.map((l) => (
                    <Badge key={l} tone="neutral">
                      <Globe className="mr-2 h-3.5 w-3.5" />
                      {l}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <GradientDivider />

            <div className="p-5">
              <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
                Bio
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#0B1220] dark:text-white">
                {data.bio}
              </p>
            </div>

            <div className="px-5 pb-5">
              <OutlineBlueLink to="/about">
                About me <ChevronRight className="h-4 w-4" />
              </OutlineBlueLink>
            </div>
          </Card>
        </MotionDiv>

        {/* Right side: details */}
        <MotionSection
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Contact details</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Used for notifications and internal references.
                </p>
              </div>

              <OutlineBlueLink to="/">
                Go to Home Page <ChevronRight className="h-4 w-4" />
              </OutlineBlueLink>
            </div>

            <GradientDivider />

            <div className="p-5">
              <div className="divide-y divide-[#E5E7EB] dark:divide-[#1F2937]">
                <FieldRow icon={Mail} label="Email"
                  value={
                    <a
                      href={`mailto:${email}`}
                      onClick={(e) => {
                        // If something higher up hijacks clicks (Router / wrapper), prevent that.
                        e.stopPropagation();
                      }}
                      className="
                        text-sm font-semibold text-[#0B1220] dark:text-white
                        hover:text-[#2F80ED] dark:hover:text-[#60A5FA]
                        focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/20 rounded-lg px-1 -mx-1
                        transition-colors
                      "
                    >
                      {email}
                    </a>
                  }
                />
                <FieldRowLink icon={Phone} label="Phone" href="tel:+359889116617" value={phone} />
                <FieldRow icon={MapPin} label="Location" value={
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        data.location
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        text-sm font-semibold text-[#0B1220] dark:text-white
                        hover:text-[#2F80ED] dark:hover:text-[#60A5FA]
                        focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/20 rounded-lg px-1 -mx-1
                        transition-colors
                      "
                      title="Open directions in Google Maps"
                    >
                      {data.location}
                    </a>
                } />
              </div>
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <div className="p-4 pb-3">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Small things that help consistency.
                </p>
              </div>
              <GradientDivider />
              <div className="p-5 flex flex-wrap gap-2">
                <Badge tone="blue">Timezone: Europe/Sofia</Badge>
                <Badge tone="blue">Week starts: Monday</Badge>
              </div>
            </Card>

            <Card id='security' className="scroll-mt-28">
              <div className="p-4 pb-3">
                <h3 className="text-lg font-semibold">Security</h3>
                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  Change your password (you’ll log in again).
                </p>
              </div>
              <GradientDivider />

              <div className="p-5">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm((s) => !s)}
                  className="w-full inline-flex items-center justify-between gap-2 rounded-2xl border border-[#2F80ED] text-[#2F80ED] px-4 py-2.5 font-semibold hover:bg-[#2F80ED] hover:text-white transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    Change password
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      showPasswordForm ? "rotate-90" : ""
                    }`}
                  />
                </button>
              
                <AnimatePresence initial={false}>
                  {showPasswordForm && (
                    <MotionDiv
                      key="pwform"
                      initial={{ height: 0, opacity: 0, y: -6 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4">
                        <ChangePasswordForm />
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>

            </Card>
          </div>
        </MotionSection>
      </main>

      <footer className="py-6 text-center text-sm text-[#334155] dark:text-[#94A3B8]">
        © {new Date().getFullYear()} LexSchedule. All rights reserved.
      </footer>
    </div>
  );
}
