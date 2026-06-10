import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import { AnimatePresence } from "framer-motion";
import PageShell from "./components/PageShell";
import AdminDashboard from "./components/admin/Dashboard";
import ClientDashboard from "./components/clients/ClientDashboard";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Logout from "./components/logout/Logout";
import { UserProvider } from "./providers/UserProvider";
import AuthGuard from "./components/guards/AuthGuard";
import { ToastContainer } from "react-toastify";
import Catalog from "./components/admin/Catalog";
import AppointmentDetails from "./components/details/Details";
import CreateAppointmentPage from "./components/create/Create";
import EditAppointment from "./components/edit/Edit";
import GuestGuard from "./components/guards/GuestGuard";
import AdminGuard from "./components/guards/AdminGuard";
import ClientGuard from "./components/guards/ClientGuard";
import TimeOffPage from "./components/admin/TimeOff";
import TimeOffDetailsPage from "./components/admin/TimeOffDetails";
import ScheduleEditor from "./components/admin/ScheduleEditor";
import SchedulePage from "./components/schedule/Schedule";
import DayDetailsPage from "./components/day/DayDetails";
import ProfilePage from "./components/profil/Profil";
import AboutMePage from "./components/about/AboutMe";
import ForgotPassword from "./components/forgot/ForgotPassword";
import ResetPassword from "./components/forgot/ResetPassword";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const location = useLocation();
  return (
    <ErrorBoundary>
    <UserProvider>
      <div>
        <Header />

        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={<PageShell><Home /></PageShell>} />
          <Route path="/about" element={<PageShell><AboutMePage /></PageShell>} />
          <Route element={<AuthGuard />}>
            <Route path="/logout" element={<PageShell><Logout /></PageShell>} />
            <Route path="/appointments" element={<PageShell><Catalog /></PageShell>} />
            <Route path="/create" element={<PageShell><CreateAppointmentPage /></PageShell>} />
            <Route path="/appointments/:appointmentId/details" element={<PageShell><AppointmentDetails /></PageShell>} />
            <Route path="/appointments/:appointmentId/update" element={<PageShell><EditAppointment /></PageShell>} />
            <Route path="/timeoff/:date" element={<PageShell><TimeOffDetailsPage /></PageShell>} />
            <Route path="/schedule" element={<PageShell><SchedulePage /></PageShell>} />
            <Route element={<AdminGuard />}>
              <Route path="/schedule/edit" element={<PageShell><ScheduleEditor /></PageShell>} />
            </Route>
            <Route path="/day/:date" element={<PageShell><DayDetailsPage /></PageShell>} />
            <Route path="/profile" element={<PageShell><ProfilePage /></PageShell>} />
          </Route>
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<PageShell><AdminDashboard /></PageShell>} />
            <Route path="/timeoff" element={<PageShell><TimeOffPage /></PageShell>} />
          </Route>
          <Route element={<ClientGuard />}>
            <Route path="/client" element={<PageShell><ClientDashboard /></PageShell>} />
          </Route>
          <Route element={<GuestGuard />}>
            <Route path="/register" element={<PageShell><Register /></PageShell>} />
            <Route path="/login" element={<PageShell><Login /></PageShell>} />
            <Route path="/forgot-password" element={<PageShell><ForgotPassword /></PageShell>} />
            <Route path="/reset-password/:token" element={<PageShell><ResetPassword /></PageShell>} />
          </Route>

        </Routes>
        </AnimatePresence>

        <ToastContainer />
      </div>
    </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
