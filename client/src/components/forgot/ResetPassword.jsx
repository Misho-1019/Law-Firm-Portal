import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import request from "../../utils/request";
import { showToast } from "../../utils/toastUtils";
import { api } from "../../config/api";

const baseUrl = api.auth;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password.length < 6) return showToast("Password must be at least 6 characters.", "warning");
    if (password !== confirmPassword) return showToast("Passwords do not match.", "warning");

    setLoading(true);
    try {
      await request.post(`${baseUrl}/reset-password`, { token, newPassword: password });
      showToast("Password reset successfully. You can now log in.", "success");
      navigate("/login");
    } catch (err) {
      showToast(err?.message || "Something went wrong.", "error");
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
            <h1 className="text-xl font-semibold">Reset Password</h1>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative flex items-center gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2">
                <Lock className="h-4 w-4 text-[#94A3B8]" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  required
                  minLength={6}
                  className="w-full bg-transparent text-sm outline-none pr-8"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 text-[#94A3B8]">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative flex items-center gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] px-3 py-2">
                <Lock className="h-4 w-4 text-[#94A3B8]" />
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full bg-transparent text-sm outline-none pr-8"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#2F80ED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D64C1] disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
