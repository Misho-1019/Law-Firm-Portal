import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import request from "../../utils/request";
import { showToast } from "../../utils/toastUtils";
import { api } from "../../config/api";

const baseUrl = api.auth;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await request.post(`${baseUrl}/forgot-password`, { email: email.trim() });
      setSent(true);
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0E1726] text-[#0B1220] dark:text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#E5E7EB] mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-6">
            <h1 className="text-xl font-semibold">Forgot Password</h1>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Enter your email and we'll send you a reset link.
            </p>

            {sent ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  If an account with that email exists, a reset link has been sent. Check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2">
                  <Mail className="h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#2F80ED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D64C1] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
