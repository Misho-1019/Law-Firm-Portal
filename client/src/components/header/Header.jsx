import { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Menu,
  X,
  Plus,
  LayoutDashboard,
  LogOut,
  Home,
  CalendarRange,
  Clock3,
  Wrench,
  UserPlus,
  LogIn,
  Gavel,
} from "lucide-react";
import { Link } from "react-router";
import { UserContext } from "../../context/UserContext";

const MotionSpan = motion.span;

export default function Header({ initialActive = "Home" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(initialActive);
  const { email, role } = useContext(UserContext);

  const guestItems = [
    { label: "Register", href: "/register", icon: UserPlus },
    { label: "Login", href: "/login", icon: LogIn },
    { label: "Create appointment", href: "/create", icon: CalendarRange },
  ];

  const adminItems = [
    { label: "Appointments", href: "/appointments", icon: CalendarRange },
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Time Off", href: "/timeoff", icon: Gavel },
    { label: "Schedule", href: "/schedule", icon: Clock3 },
    // { label: "Change Your Schedule", href: "/scheduleditor", icon: Wrench },
    { label: "Logout", href: "/logout", icon: LogOut },
  ];

  const clientItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/client", icon: LayoutDashboard },
    { label: "Schedule", href: "/schedule", icon: CalendarIcon },
    { label: "Logout", href: "/logout", icon: LogOut },
  ];

  const items =
    email && role === "Admin"
      ? adminItems
      : email && role === "Client"
      ? clientItems
      : guestItems;

  const NavLink = ({ label, href, icon: Icon }) => {
    const isActive = active === label;
    return (
      <li className="relative py-2">
        <Link
          to={href}
          onClick={() => setActive(label)}
          className={`px-1 transition-colors ${
            isActive ? "text-white" : "text-white/80 hover:text-white"
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
          </span>
        </Link>
        {isActive && (
          <MotionSpan
            layoutId="active-underline"
            className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 40,
              mass: 0.6,
            }}
          />
        )}
      </li>
    );
  };

  return (
    <header className="relative overflow-hidden bg-[#0E1726] text-white">
      {/* Soft glow background (same style, tuned for dark header) */}
      <div className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full bg-[#2F80ED]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
    
      {/* Optional subtle texture line (very light) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_20%_10%,#ffffff_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#2F80ED_0%,transparent_40%),radial-gradient(circle_at_20%_90%,#7C3AED_0%,transparent_45%)]" />
    
      {/* Top bar */}
      <div className="relative mx-auto max-w-7xl px-5 py-3 flex items-center">
        {/* LEFT: brand */}
        <div className="flex items-center flex-1">
          {role === "Client" ? (
            <Link to="/" className="flex items-center gap-2 font-semibold select-none">
              <CalendarIcon className="h-5 w-5" />
              <span className="relative leading-tight">
                <span className="bg-gradient-to-r from-[#2F80ED] via-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent font-semibold">
                  LexSchedule
                </span>
                <span className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
              </span>
            </Link>
          ) : (
            <Link
              to={role === "Admin" ? "/admin" : "/"}
              className="flex items-center gap-2 font-semibold select-none"
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="relative leading-tight">
                <span className="bg-gradient-to-r from-[#2F80ED] via-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent font-semibold">
                  LexSchedule
                </span>
                <span className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
              </span>
            </Link>
          )}
        </div>
    
        {/* CENTER: nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {items.map((it) => (
              <NavLink key={it.label} {...it} />
            ))}
          </ul>
        </nav>
    
        {/* RIGHT: CTA + mobile toggle */}
        <div className="flex items-center justify-end flex-1 gap-2">
          <div className="hidden md:flex items-center">
            <Link
              to="/create"
              onClick={() => setActive("Create appointment")}
              className="relative inline-flex items-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-1.5 font-semibold text-white hover:bg-[#266DDE]
                         focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
            >
              <Plus className="h-4 w-4" />
              Create appointment
              <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />
            </Link>
          </div>
    
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    
      {/* Divider */}
      <div className="relative h-[2px] bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />
    
      {/* Mobile menu */}
      {open && (
        <nav className="relative md:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-3 grid gap-2 text-sm">
            {items.map((it) => (
              <li key={it.label}>
                <Link
                  className="block py-2"
                  to={it.href}
                  onClick={() => {
                    setActive(it.label);
                    setOpen(false);
                  }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {it.icon && <it.icon className="h-4 w-4" />}
                    <span>{it.label}</span>
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/create"
                onClick={() => {
                  setActive("Create appointment");
                  setOpen(false);
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-2 font-semibold text-white hover:bg-[#266DDE]"
              >
                <Plus className="h-4 w-4" /> Create appointment
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
