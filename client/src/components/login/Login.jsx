import React from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Mail, Lock, ArrowRight, Eye, EyeOff, Monitor, Moon, Sun } from "lucide-react";
import { Link } from "react-router";

const MotionSection = motion.section;

/* ----------------------------------------------------------
   Tri-state theme hook (system / light / dark)
---------------------------------------------------------- */
function useThemeMode() {
  const getInitial = () => (typeof window === 'undefined' ? 'system' : localStorage.getItem('theme-mode') || 'system');
  const [mode, setMode] = React.useState(getInitial);
  const [systemDark, setSystemDark] = React.useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    try { mql.addEventListener('change', onChange); } catch { mql.addListener(onChange); }
    return () => { try { mql.removeEventListener('change', onChange); } catch { mql.removeListener(onChange); } };
  }, []);
  React.useEffect(() => {
    if (mode !== 'system') localStorage.setItem('theme-mode', mode);
    else localStorage.removeItem('theme-mode');
  }, [mode]);
  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  const cycle = () => setMode((m) => (m === 'system' ? 'dark' : m === 'dark' ? 'light' : 'system'));
  return { mode, isDark, cycle };
}

/* ----------------------------------------------------------
   Validation (mirror model expectations for password)
---------------------------------------------------------- */
const EMAIL_REGEX = /@[a-zA-Z]+.[a-zA-Z]+$/; // same as model
const PASSWORD_REGEX = /^\w+$/; // letters, numbers, underscore

function validate(values) {
  const errors = {};
  const email = values.email?.trim() || '';
  const password = values.password?.trim() || '';

  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Email must look like name@domain.tld';

  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'At least 6 characters.';
  else if (!PASSWORD_REGEX.test(password)) errors.password = 'Letters, numbers, underscore only.';

  return errors;
}

/* ----------------------------------------------------------
   Login page (email + password only)
---------------------------------------------------------- */
export default function Login() {
  const { isDark } = useThemeMode();
  const [values, setValues] = React.useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = React.useState(false);
  const [touched, setTouched] = React.useState({});

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const onBlur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Wire to your API here:
    // await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(values) })
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        
        {/* Card */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-7">
              <h1 className="text-2xl font-semibold">Sign in</h1>
              <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">Use your email and password.</p>

              <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
                {/* Email */}
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="name@domain.tld"
                  value={values.email}
                  onChange={set('email')}
                  onBlur={onBlur('email')}
                  error={touched.email && errors.email}
                />

                {/* Password */}
                <PasswordField
                  label="Password"
                  id="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={set('password')}
                  onBlur={onBlur('password')}
                  error={touched.password && errors.password}
                  show={showPwd}
                  setShow={setShowPwd}
                />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#334155] dark:text-[#94A3B8]">Forgot your password? <a href="/forgot" className="text-[#2F80ED] hover:underline">Reset</a></span>
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className={`relative inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-4 ${isValid ? 'bg-[#2F80ED] text-white hover:bg-[#266DDE] focus:ring-[#2F80ED]/40' : 'bg-[#2F80ED]/50 text-white/80 cursor-not-allowed focus:ring-transparent'}`}
                >
                  Sign in <ArrowRight className="h-4 w-4" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                </button>

                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">No account? <Link className="text-[#2F80ED] hover:underline" to="/register">Register</Link>.</p>
              </form>
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

/* ----------------------------------------------------------
   Fields
---------------------------------------------------------- */
function Field({ id, label, icon, type = 'text', placeholder = '', value, onChange, onBlur, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className={`rounded-2xl border px-3 py-2 focus-within:ring-4 transition ${error ? 'border-[#B91C1C] focus-within:ring-[#B91C1C]/30' : 'border-[#E5E7EB] dark:border-[#1F2937] focus-within:ring-[rgb(47,128,237)/0.35]'}`}>
        <div className="flex items-center gap-2">
          {icon ? <span className="text-[#334155] dark:text-[#94A3B8]">{icon}</span> : null}
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
          />
        </div>
      </div>
      {error ? <p className="text-xs text-[#B91C1C]">{error}</p> : null}
    </div>
  );
}

function PasswordField({ id, label, placeholder, value, onChange, onBlur, error, show, setShow }) {
  const ToggleIcon = show ? Eye : EyeOff;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className={`rounded-2xl border px-3 py-2 focus-within:ring-4 transition ${error ? 'border-[#B91C1C] focus-within:ring-[#B91C1C]/30' : 'border-[#E5E7EB] dark:border-[#1F2937] focus-within:ring-[rgb(47,128,237)/0.35]'}`}>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
          <input
            id={id}
            type={show ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="p-1 rounded-md hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.08)]">
            <ToggleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error ? <p className="text-xs text-[#B91C1C]">{error}</p> : null}
    </div>
  );
}
