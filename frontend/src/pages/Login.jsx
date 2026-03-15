import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userApi } from '../services/api.js'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await userApi.login({ email, password })
      localStorage.setItem('token', data.token)
      onLogin(data.token)
      nav('/')
    } catch (err) {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit} style={{maxWidth:400}}>
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <div className="field"><label>Contrasena</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
        {error && <p style={{color:'crimson'}}>{error}</p>}
        <button className="btn">Entrar</button>
      </form>
      <p>No tienes cuenta? <Link to="/register">Registrate</Link></p>
      <p><Link to="/password-reset">Olvidaste tu contrasena?</Link></p>
    </div>
  )
}
