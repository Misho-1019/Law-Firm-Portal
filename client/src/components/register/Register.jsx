import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone as PhoneIcon,
  ArrowRight,
  EyeOff,
  Eye
} from "lucide-react";
import { useRegister } from "../../api/authApi";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

const MotionSection = motion.section;

export default function Register() {
  const navigate = useNavigate();
  const { register } = useRegister();
  const { userLoginHandler } = useContext(UserContext);

  const registerHandler = async (formData) => {
    const values = Object.fromEntries(formData);

    const confirmPassword = formData.get("confirmPassword");

    if (confirmPassword !== values.password) {
      console.log("Password mismatch!");

      return;
    }

    const authData = await register(
      values.username,
      values.email,
      values.password,
    );

    userLoginHandler(authData);

    navigate(`/`);
  };
  return (
    // Force dark for preview parity; remove 'dark' to respect system
    <div className="dark">
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
                <h1 className="text-2xl font-semibold">
                  Create your LexSchedule account
                </h1>
                <p className="mt-1 text-sm text-[#334155] dark:text-[#94A3B8]">
                  Public sign-up is for{" "}
                  <span className="font-medium">Clients</span>. Admins are
                  invited by the firm.
                </p>

                {/* UI-only form: no state, no validation, no handlers */}
                <form
                  className="mt-6 space-y-5"
                  action={registerHandler}
                >
                  {/* Username */}
                  <Field
                    label="Username"
                    id="username"
                    name="username"
                    icon={<User className="h-4 w-4" />}
                    placeholder="ivan.petrov"
                    hint="Min 2 characters. Will be visible to staff."
                  />

                  {/* Email */}
                  <Field
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="ivan.petrov@example.com"
                    hint="Must look like name@domain.tld"
                  />

                  {/* Password */}
                  <PasswordField
                    label="Password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    hint="At least 6 characters. Letters, numbers, underscore only."
                  />

                  {/* Confirm */}
                  <PasswordField
                    label="Confirm password"
                    id="confirm"
                    name="confirmPassword"
                    placeholder="••••••••"
                  />

                  {/* Phone (optional) */}
                  <Field
                    label="Phone (optional)"
                    id="phone"
                    name="phone"
                    type="tel"
                    icon={<PhoneIcon className="h-4 w-4" />}
                    placeholder="+359 88 123 4567"
                  />

                  {/* CTA (button type=button to avoid form submit) */}
                  <button
                    type="submit"
                    className="relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
                  >
                    Create account <ArrowRight className="h-4 w-4" />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                  </button>

                  {/* Legal + link */}
                  <p className="text-xs text-[#334155] dark:text-[#94A3B8]">
                    By continuing, you agree to our Terms and Privacy Policy.
                  </p>
                  <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                    Already have an account?{" "}
                    <Link
                      className="text-[#2F80ED] hover:underline"
                      to="/login"
                    >
                      Sign in
                    </Link>
                    .
                  </p>
                </form>
              </div>

              {/* Side panel */}
              <div className="md:col-span-2 hidden md:block bg-[#0E1726] text-white">
                <div className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold relative pb-2">
                      Registration rules
                    </h2>
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent" />
                    <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                      <li>Username: min 2 chars</li>
                      <li>Email: name@domain.tld</li>
                      <li>Password: ≥ 6, letters/numbers/_ only</li>
                      <li>Role: Client (default)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-white/70">
                    Unique checks (username/email) happen on the server.
                  </p>
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
   Presentational fields (no state, no validation)
---------------------------------------------------------- */
function Field({
  id,
  name,
  label,
  icon,
  type = "text",
  placeholder = "",
  hint,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35]">
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="text-[#334155] dark:text-[#94A3B8]">{icon}</span>
          ) : null}
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
          />
        </div>
      </div>
      {hint ? (
        <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p>
      ) : null}
    </div>
  );
}

function PasswordField({ id, name, label, placeholder, hint }) {
  const [show, setShow] = useState(false);
  const ToggleIcon = show ? Eye : EyeOff;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2 focus-within:ring-4 focus-within:ring-[rgb(47,128,237)/0.35]">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
          <input
            id={id}
            name={name}
            type={show ? "text" : "password"}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="p-1 rounded-md hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.08)] text-[#334155] dark:text-[#94A3B8]"
          >
            <ToggleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {hint ? (
        <p className="text-xs text-[#334155] dark:text-[#94A3B8]">{hint}</p>
      ) : null}
    </div>
  );
}
