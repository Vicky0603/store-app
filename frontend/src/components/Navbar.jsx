import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cartApi } from '../services/api.js'
import { useCart } from '../contexts/CartContext.jsx'

export default function Navbar({ authed, onLogout }) {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const cart = useCart()
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
  }, [theme])
  const refresh = async ()=>{
    if(!authed){ setCount(0); return }
    setCount(cart.count)
  }
  useEffect(()=>{ refresh() }, [authed])
  useEffect(()=>{
    setCount(cart.count)
  }, [cart.count])
  return (
    <nav className="nav">
      <Link className="brand" to="/">Tienda</Link>
      <Link to="/cart">Carrito {count? <span className="badge">{count}</span>: null}</Link>
      <div className="spacer" />
      <button className="btn secondary" onClick={()=> setTheme(prev => prev==='dark'?'light':'dark')}>
        {theme==='dark' ? 'Modo claro' : 'Modo oscuro'}
      </button>
      {authed ? (
        <>
          <Link to="/orders">Ordenes</Link>
          <Link to="/profile">Perfil</Link>
          <button className="btn" onClick={onLogout}>Salir</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}
    </nav>
  )
}
