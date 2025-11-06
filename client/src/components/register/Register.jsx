import React from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Mail, Lock, User, Phone as PhoneIcon, ArrowRight, Eye, EyeOff, Monitor, Moon, Sun } from "lucide-react";
import { Link } from "react-router";

// Motion aliases
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

function ThemeToggle() {
  const { mode, cycle } = useThemeMode();
  const Icon = mode === 'system' ? Monitor : mode === 'dark' ? Moon : Sun;
  return (
    <button
      onClick={cycle}
      className="inline-flex items-center gap-2 rounded-2xl bg-[#2F80ED] px-3 py-1.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
      title={`Theme: ${mode} (click to change)`}
    >
      <Icon className="h-4 w-4" /> <span className="capitalize">{mode}</span>
    </button>
  );
}

/* ----------------------------------------------------------
   Model-aware validation (matches your Mongoose schema)
   - username: required, min 2, trimmed, unique (server), string
   - email: required, unique (server), lowercase, /\@[a-zA-Z]+.[a-zA-Z]+$/
   - password: required, min 6, /^\w+$/ (letters, numbers, underscore only), trimmed
   - role: 'Client' | 'Admin' (default 'Client') → public registration locks to 'Client'
   - phone: optional
---------------------------------------------------------- */
const EMAIL_REGEX = /@[a-zA-Z]+.[a-zA-Z]+$/; // mirrors your model
const PASSWORD_REGEX = /^\w+$/; // word chars only

function validate(values) {
  const errors = {};
  const username = values.username?.trim() || '';
  const email = values.email?.trim() || '';
  const password = values.password?.trim() || '';
  const confirm = values.confirm?.trim() || '';

  if (!username) errors.username = 'Username is required.';
  else if (username.length < 2) errors.username = 'Must be at least 2 characters.';

  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Email must look like name@domain.tld';

  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'At least 6 characters.';
  else if (!PASSWORD_REGEX.test(password)) errors.password = 'Letters, numbers, underscore only.';

  if (!confirm) errors.confirm = 'Please confirm your password.';
  else if (confirm !== password) errors.confirm = 'Passwords do not match.';

  // role locked to Client on UI (server can override if needed)
  return errors;
}

/* ----------------------------------------------------------
   Register page component (UI + client-side validation only)
---------------------------------------------------------- */
export default function Register() {
  const { isDark } = useThemeMode();

  const [values, setValues] = React.useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    role: 'Client', // locked
  });
  const [showPwd, setShowPwd] = React.useState(false);
  const [touched, setTouched] = React.useState({});

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const onBlur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = (e) => {
    e.preventDefault();
    // UI-only: integrate your API call here (e.g., POST /auth/register)
    // fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(values) })
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white transition-colors">
        
        {/* Form card */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <MotionSection
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
          >
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-6 md:p-8">
                <h1 className="text-2xl font-semibold">Create your LexSchedule account</h1>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">Public sign-up is for <span className="font-medium">Clients</span>. Admins are invited by the firm.</p>

                <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
                  {/* Username */}
                  <Field label="Username" id="username" icon={<User className="h-4 w-4" />} placeholder="ivan.petrov" value={values.username} onChange={set('username')} onBlur={onBlur('username')} error={touched.username && errors.username} hint="Min 2 characters. Will be visible to staff." />

                  {/* Email */}
                  <Field label="Email" id="email" type="email" icon={<Mail className="h-4 w-4" />} placeholder="ivan.petrov@example.com" value={values.email} onChange={set('email')} onBlur={onBlur('email')} error={touched.email && errors.email} hint="Must look like name@domain.tld" />

                  {/* Password */}
                  <PasswordField label="Password" id="password" placeholder="••••••••" value={values.password} onChange={set('password')} onBlur={onBlur('password')} error={touched.password && errors.password} hint="At least 6 characters. Letters, numbers, underscore only." show={showPwd} setShow={setShowPwd} />

                  {/* Confirm */}
                  <PasswordField label="Confirm password" id="confirm" placeholder="••••••••" value={values.confirm} onChange={set('confirm')} onBlur={onBlur('confirm')} error={touched.confirm && errors.confirm} show={showPwd} setShow={setShowPwd} />

                  {/* Phone (optional) */}
                  <Field label="Phone (optional)" id="phone" type="tel" icon={<PhoneIcon className="h-4 w-4" />} placeholder="+359 88 123 4567" value={values.phone} onChange={set('phone')} onBlur={onBlur('phone')} />
                  
                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`relative inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-4 ${isValid ? 'bg-[#2F80ED] text-white hover:bg-[#266DDE] focus:ring-[#2F80ED]/40' : 'bg-[#2F80ED]/50 text-white/80 cursor-not-allowed focus:ring-transparent'}`}
                    aria-disabled={!isValid}
                  >
                    Create account <ArrowRight className="h-4 w-4" />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                  </button>

                  {/* Legal + link */}
                  <p className="text-xs text-[#334155] dark:text-[#94A3B8]">By continuing, you agree to our Terms and Privacy Policy.</p>
                  <p className="text-sm text-[#334155] dark:text-[#94A3B8]">Already have an account? <Link className="text-[#2F80ED] hover:underline" to="/login">Sign in</Link>.</p>
                </form>
              </div>

              {/* Side panel */}
              <div className="md:col-span-2 hidden md:block bg-[#0E1726] text-white">
                <div className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold relative pb-2">Registration rules</h2>
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
                    <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                      <li>Username: min 2 chars</li>
                      <li>Email: name@domain.tld</li>
                      <li>Password: ≥ 6, letters/numbers/_ only</li>
                      <li>Role: Client (default)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-white/70">Unique checks (username/email) happen on the server.</p>
                </div>
              </div>
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
   Small field components
---------------------------------------------------------- */
function Field({ id, label, icon, hint, type = 'text', placeholder = '', value, onChange, onBlur, error }) {
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
      {error ? <p className="text-xs text-[#B91C1C]">{error}</p> : hint ? <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p> : null}
    </div>
  );
}

function PasswordField({ id, label, placeholder, value, onChange, onBlur, error, hint, show, setShow }) {
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
      {error ? <p className="text-xs text-[#B91C1C]">{error}</p> : hint ? <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p> : null}
    </div>
  );
}
