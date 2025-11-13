import { Route, Routes } from "react-router";
import "./App.css";
import AdminDashboard from "./components/adminDash/Dashboard";
import ClientDashboard from "./components/clientsDash/ClientDashboard";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Logout from "./components/logout/Logout";
import { UserProvider } from "./providers/UserProvider";

function App() {
  return (
    <UserProvider>
      <div>
        <Header />
        {/* <AdminDashboard /> */}
        {/* <ClientDashboard /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
