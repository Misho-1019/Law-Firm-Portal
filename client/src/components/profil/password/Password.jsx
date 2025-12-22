import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Save } from "lucide-react";
import { useChangePassword } from "../../../api/authApi";
import { UserContext } from "../../../context/UserContext";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { changePassword } = useChangePassword();
  const { userLogoutHandler } = useContext(UserContext)

  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setIsSaving(true);
      await changePassword(currentPassword, newPassword);

      userLogoutHandler()

      // tokenVersion bump => old cookie JWT becomes invalid
      navigate("/login");
    } catch (err) {
      setError(err?.message || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
          Current password
        </div>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-[#2F80ED]/20"
        />
      </label>

      <label className="block">
        <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
          New password
        </div>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-[#2F80ED]/20"
        />
      </label>

      <label className="block">
        <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
          Confirm new password
        </div>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-[#2F80ED]/20"
        />
      </label>

      {error ? (
        <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F80ED] px-4 py-2.5 font-semibold text-white hover:bg-[#266DDE] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40 disabled:opacity-60"
      >
        <Lock className="h-4 w-4" />
        {isSaving ? "Saving..." : "Update password"}
        <Save className="h-4 w-4" />
      </button>
    </form>
  );
}
