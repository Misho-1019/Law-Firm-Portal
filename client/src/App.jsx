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

function App() {
  return (
    <UserProvider>
      <div>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthGuard />}>
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/client" element={<ClientDashboard />} />
          </Route>
          <Route>
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
