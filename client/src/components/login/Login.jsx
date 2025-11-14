// Login.jsx — UI-only (no functionality)
// - No state, no validation, no navigation, no handlers
// - Pure presentational components with Framer Motion + Tailwind

import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../api/authApi";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const MotionSection = motion.section;

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export default function Login() {
  const navigate = useNavigate();
  const { login } = useLogin()
  const { userLoginHandler } = useUserContext()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const loginHandler = async (data) => {
    try {
      const authData = await login(data.email, data.password)

      userLoginHandler(authData)

      toast.success('Login successful', {
        position: 'top-center',
        autoClose: 2000,
        theme: 'light',
      })

      navigate('/')
    } catch (error) {
      toast.error(error.message || 'Login failed', {
        position: 'top-center',
        autoClose: 2000,
        theme: 'light'
      })
    }
  }

  // const [_, loginAction, isPending] = useActionState(loginHandler, {
  //   email: '', password: ''
  // })

  return (
    <div className="dark">
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

              {/* UI-only form (no handlers) */}
              <form className="mt-6 space-y-5" onSubmit={handleSubmit(loginHandler)} noValidate>
                {/* Email */}
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  name="email"
                  icon={<Mail className="h-4 w-4" />}
                  {...register('email')}
                  aria-invalid={!!errors.email}   
                  placeholder="name@domain.tld"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

                {/* Password */}
                <PasswordField
                  label="Password"
                  id="password"
                  name="password"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#334155] dark:text-[#94A3B8]">
                    {/* Plain anchor to avoid Router dependency */}
                    Forgot your password? <Link to="/forgot" className="text-[#2F80ED] hover:underline">Reset</Link>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none bg-[#2F80ED] text-white hover:bg-[#266DDE] focus:ring-4 focus:ring-[#2F80ED]/40"
                >
                  Sign in <ArrowRight className="h-4 w-4" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl p-[2px] opacity-0 transition-opacity hover:opacity-100 [background:conic-gradient(at_50%_50%,#2F80ED_0%,#06B6D4_35%,#7C3AED_70%,#2F80ED_100%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"></span>
                </button>

                <p className="text-sm text-[#334155] dark:text-[#94A3B8]">
                  No account? <Link className="text-[#2F80ED] hover:underline" to="/register">Register</Link>.
                </p>
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
   Fields (presentational only)
---------------------------------------------------------- */
function Field({ id, label, icon, type = "text", name, placeholder = "", ...inputProps }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="rounded-2xl border px-3 py-2 focus-within:ring-4 transition border-[#E5E7EB] dark:border-[#1F2937] focus-within:ring-[rgb(47,128,237)/0.35]">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-[#334155] dark:text-[#94A3B8]">{icon}</span> : null}
          <input
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
            autoComplete={name}
            {...inputProps}
          />
        </div>
      </div>
    </div>
  );
}

function PasswordField({ id, label, name, placeholder, ...inputProps }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="rounded-2xl border px-3 py-2 focus-within:ring-4 transition border-[#E5E7EB] dark:border-[#1F2937] focus-within:ring-[rgb(47,128,237)/0.35]">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />
          <input
            id={id}
            type="password"
            name={name}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
            autoComplete="current-password"
            {...inputProps}
          />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Minimal UI smoke tests (commented for Vitest/Jest)
---------------------------------------------------------- */
/*
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Login UI-only', () => {
  it('renders without crashing', () => {
    const { getByText, getByLabelText } = render(<Login />);
    getByText(/sign in/i);
    getByLabelText(/email/i);
    getByLabelText(/password/i);
  });
});
*/
