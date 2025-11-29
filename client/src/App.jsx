import { Route, Routes } from "react-router";
import "./App.css";
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

function App() {
  return (
    <UserProvider>
      <div>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthGuard />}>
            <Route path="/logout" element={<Logout />} />
            <Route path="/appointments" element={<Catalog />} />
            <Route path="/create" element={<CreateAppointmentPage />} />
            <Route path="/appointments/:appointmentId/details" element={<AppointmentDetails />} />
            <Route path="/appointments/:appointmentId/update" element={<EditAppointment />} />
          </Route>
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/timeoff" element={<TimeOffPage />} />
            <Route path="/timeoff/:date" element={<TimeOffDetailsPage />} />
          </Route>
          <Route element={<ClientGuard />}>
            <Route path="/client" element={<ClientDashboard />} />
          </Route>
          <Route element={<GuestGuard />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </UserProvider>
  );
}

export default App;
