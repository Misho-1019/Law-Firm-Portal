import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Menu, X, Plus } from "lucide-react";
import { Link } from "react-router";
import { UserContext } from "../../context/UserContext";

// Concrete motion element to enable the animated underline (and keep ESLint happy)
const MotionSpan = motion.span;

/**
 * Header with animated gradient underline that moves to the active nav item.
 * Responsive with a mobile drawer. Pure JSX (no TypeScript).
 */
export default function Header({ initialActive = "Home" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(initialActive);
  const { email, role } = useContext(UserContext)

  const guestItems = [
    { label: "Home", href: "/" },
    { label: "Register", href: "/register" },
    { label: "Login", href: "/login" },
    { label: "Create appointment", href: "/create" },
  ]
  
  const adminItems = [
    { label: "Appointments", href: "/appointments" },
    { label: "Dashboard", href: "/admin" },
    { label: "Create appointment", href: "/create" },
    { label: "Logout", href: "/logout" },
  ]
  
  const clientItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/client" },
    { label: "Appointments", href: "/appointments" },
    { label: "Create appointment", href: "/create" },
    { label: "Logout", href: "/logout" },
  ]

  const items = email && role === "Admin" ? adminItems : email && role === "Client" ? clientItems : guestItems

  const NavLink = ({ label, href }) => {
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
          {label}
        </Link>
        {isActive && (
          <MotionSpan
            layoutId="active-underline"
            className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent"
            transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.6 }}
          />
        )}
      </li>
    );
  };

  return (
    <header className="bg-[#0E1726] text-white">
      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-semibold select-none">
          <CalendarIcon className="h-5 w-5" />
          <span className="relative leading-tight">
            <span className="bg-gradient-to-r from-[#2F80ED] via-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent font-semibold">
              LexSchedule
            </span>
            <span className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {items.map((it) => (
              <NavLink key={it.label} {...it} />
            ))}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/create"
            onClick={() => setActive("Create appointment")}
            className="relative inline-flex items-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-1.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
          >
            <Plus className="h-4 w-4" />
            Create appointment
            <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />
          </Link>
        </div>

        {/* Mobile toggle */}
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

      {/* Gradient divider between brand row and menu (your favorite) */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#2F80ED]/70 to-transparent" />

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden">
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
                  {it.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/create"
                onClick={() => setActive("Create appointment")}
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
