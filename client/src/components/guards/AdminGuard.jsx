import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function AdminGuard() {
    const { isAuthenticated, role } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to='/login'/>
    }
    else if (role !== 'Admin') {
        return <Navigate to='/client'/>
    }

    return <Outlet/>
}