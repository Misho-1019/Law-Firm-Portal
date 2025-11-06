import { Route, Routes } from 'react-router'
import './App.css'
import AdminDashboard from './components/adminDash/Dashboard'
import ClientDashboard from './components/clientsDash/ClientDashboard'
import Header from './components/header/Header'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'

function App() {

  return (
    <>
    <div>
      <Header/>
      {/* <AdminDashboard /> */}
      {/* <ClientDashboard /> */}
      {/* <Register /> */}
      {/* <Login /> */}
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
    </>
  )
}

export default App
