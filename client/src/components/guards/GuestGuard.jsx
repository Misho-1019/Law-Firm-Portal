import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function GuestGuard() {
    const { isAuthenticated, role } = useAuth();

    if (isAuthenticated && role === 'Admin') {
        return <Navigate to='/admin' />
    }
    else if (isAuthenticated && role === 'Client') {
        return <Navigate to='/client' />
    }

    return <Outlet />
}