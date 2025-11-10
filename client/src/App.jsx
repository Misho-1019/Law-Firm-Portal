import { Route, Routes } from 'react-router'
import './App.css'
import AdminDashboard from './components/adminDash/Dashboard'
import ClientDashboard from './components/clientsDash/ClientDashboard'
import Header from './components/header/Header'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { useState } from 'react'

function App() {
  const [_authData, setAuthData] = useState({})

  const userLoginHandler = (resultData) => {
    setAuthData(resultData)
  }

  return (
    <>
    <div>
      <Header/>
      {/* <AdminDashboard /> */}
      {/* <ClientDashboard /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login onLogin={userLoginHandler} />} />
      </Routes>
    </div>
    </>
  )
}

export default App
