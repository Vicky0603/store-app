import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cartApi } from '../services/api.js'

export default function Navbar({ authed, onLogout }) {
  const [count, setCount] = useState(0)
  useEffect(()=>{ (async()=>{ if(authed){ try{ const {data} = await cartApi.get(); setCount((data.items||[]).reduce((s,i)=> s+i.quantity,0)) }catch{} } else setCount(0) })() }, [authed])
  return (
    <nav className="nav">
      <Link to="/">Tienda</Link>
      <Link to="/cart">Carrito{count? ` (${count})`:''}</Link>
      <div className="spacer" />
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
