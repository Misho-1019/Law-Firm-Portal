import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import Header from "./components/header/Header";
import { UserProvider } from "./providers/UserProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import AuthGuard from "./components/guards/AuthGuard";
import GuestGuard from "./components/guards/GuestGuard";
import AdminGuard from "./components/guards/AdminGuard";
import ClientGuard from "./components/guards/ClientGuard";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";
import Skeleton from "./components/Skeleton";

const Home = lazy(() => import("./components/home/Home"));
const AboutMePage = lazy(() => import("./components/about/AboutMe"));
const Login = lazy(() => import("./components/login/Login"));
const Register = lazy(() => import("./components/register/Register"));
const Logout = lazy(() => import("./components/logout/Logout"));
const Catalog = lazy(() => import("./components/admin/Catalog"));
const AppointmentDetails = lazy(() => import("./components/details/Details"));
const CreateAppointmentPage = lazy(() => import("./components/create/Create"));
const EditAppointment = lazy(() => import("./components/edit/Edit"));
const TimeOffPage = lazy(() => import("./components/admin/TimeOff"));
const TimeOffDetailsPage = lazy(() => import("./components/admin/TimeOffDetails"));
const ScheduleEditor = lazy(() => import("./components/admin/ScheduleEditor"));
const SchedulePage = lazy(() => import("./components/schedule/Schedule"));
const DayDetailsPage = lazy(() => import("./components/day/DayDetails"));
const ProfilePage = lazy(() => import("./components/profil/Profil"));
const AdminDashboard = lazy(() => import("./components/admin/Dashboard"));
const ClientDashboard = lazy(() => import("./components/clients/ClientDashboard"));
const ForgotPassword = lazy(() => import("./components/forgot/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/forgot/ResetPassword"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md px-8">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
    <SettingsProvider>
    <UserProvider>
      <div>
        <Header />

        <div className="page-content bg-slate-50 dark:bg-slate-950">
        <Suspense fallback={<LoadingFallback />}>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMePage />} />
          <Route element={<AuthGuard />}>
            <Route path="/logout" element={<Logout />} />
            <Route path="/appointments" element={<Catalog />} />
            <Route path="/create" element={<CreateAppointmentPage />} />
            <Route path="/appointments/:appointmentId/details" element={<AppointmentDetails />} />
            <Route path="/appointments/:appointmentId/update" element={<EditAppointment />} />
            <Route path="/timeoff/:date" element={<TimeOffDetailsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route element={<AdminGuard />}>
              <Route path="/schedule/edit" element={<ScheduleEditor />} />
            </Route>
            <Route path="/day/:date" element={<DayDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/timeoff" element={<TimeOffPage />} />
          </Route>
          <Route element={<ClientGuard />}>
            <Route path="/client" element={<ClientDashboard />} />
          </Route>
          <Route element={<GuestGuard />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

        </Routes>
        </Suspense>
        </div>

        <ToastContainer />
      </div>
    </UserProvider>
    </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
