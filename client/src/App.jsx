import { Route, Routes } from 'react-router'
import './App.css'
import AdminDashboard from './components/adminDash/Dashboard'
import ClientDashboard from './components/clientsDash/ClientDashboard'
import Header from './components/header/Header'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Logout from './components/logout/Logout'
import { UserContext } from './context/UserContext'
import usePersistedState from './hooks/usePersistedState'

function App() {
  const [authData, setAuthData] = usePersistedState('auth', {})

  const userLoginHandler = (resultData) => {
    setAuthData(resultData)
  }

  const userLogoutHandler = () => {
    setAuthData({})
  }

  return (
    <UserContext.Provider value={{...authData, userLoginHandler, userLogoutHandler}}>
      <div>
      <Header/>
      {/* <AdminDashboard /> */}
      {/* <ClientDashboard /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
      </Routes>
    </div>
    </UserContext.Provider>
  )
}

export default App
