import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function ClientGuard() {
    const { isAuthenticated, role } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to='/login'/>
    }
    else if (role !== 'Client') {
        return <Navigate to='/admin'/>
    }

    return <Outlet/>
}