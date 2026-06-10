import { Navigate } from "react-router";
import { useLogout } from "../../api/authApi";
import { useEffect } from "react";
import { showToast } from "../../utils/toastUtils";

export default function Logout() {
    const { isLoggedOut } = useLogout()

    useEffect(() => {
        if (isLoggedOut) {
            showToast('You have been logged out successfully.', 'success')
        }
    }, [isLoggedOut])

    return isLoggedOut 
        ? <Navigate to='/' />
        : (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
              <p className="text-sm text-[#94A3B8]">Logging out...</p>
            </div>
          )
}