import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Save, Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "../../../api/authApi";
import { UserContext } from "../../../context/UserContext";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { changePassword } = useChangePassword();
  const { userLogoutHandler } = useContext(UserContext);

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

      userLogoutHandler();

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
      <PasswordField 
        label='Current password'
        value={currentPassword}
        onChange={(e) => setCurrent(e.target.value)}
        autoComplete='current-password'
        placeholder='••••••••'
      />

      <PasswordField 
        label='New password'
        value={newPassword}
        onChange={(e) => setNew(e.target.value)}
        autoComplete='new-password'
        placeholder='••••••••'
      />

      <PasswordField 
        label='Confirm password'
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete='confirm-password'
        placeholder='••••••••'
      />

      {error ? (
        <div className="text-sm text-[#334155] dark:text-[#94A3B8]">
          {error}
        </div>
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

function PasswordField({
  label,
  value,
  onChange,
  name,
  placeholder,
  autoComplete,
  id,
}) {
  const [show, setShow] = useState(false);
  const ToggleIcon = show ? Eye : EyeOff;

  return (
    <label className="block">
      <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8]">
        {label}
      </div>

      <div className="mt-1 w-full rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] bg-transparent px-4 py-2 text-sm outline-none focus-within:ring-4 focus-within:ring-[#2F80ED]/20">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#334155] dark:text-[#94A3B8]" />

          <input
            id={id}
            name={name}
            value={value}
            type={show ? 'text' : 'password'}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="w-full bg-transparent outline-none placeholder:text-[#334155] dark:placeholder:text-[#94A3B8]"
          />

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password': 'Show password'}
            className="p-1 rounded-md hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.08)] text-[#334155] dark:text-[#94A3B8]"
          >
            <ToggleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </label>
  );
}
