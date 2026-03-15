import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Catalog from './pages/Catalog.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import Profile from './pages/Profile.jsx'
import PasswordReset from './pages/PasswordReset.jsx'
import { useEffect, useState } from 'react'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
    // notify contexts about auth change
    window.dispatchEvent(new Event('auth-changed'))
  }, [token])

  return (
    <div>
      <Navbar authed={!!token} onLogout={() => setToken(null)} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<RequireAuth authed={!!token}><Checkout /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth authed={!!token}><Orders /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth authed={!!token}><Profile /></RequireAuth>} />
          <Route path="/password-reset" element={<PasswordReset />} />
        </Routes>
      </div>
    </div>
  )
}

function RequireAuth({ authed, children }) {
  if (!authed) return <Navigate to="/login" />
  return children
}
