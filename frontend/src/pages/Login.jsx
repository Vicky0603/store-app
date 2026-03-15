import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userApi } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'
import Button from '../components/Button.jsx'
import FormField from '../components/FormField.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { isEmail } from '../utils/validate.js'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { notify } = useToast()
  const cart = useCart()
  const [fieldErrors, setFieldErrors] = useState({})
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    /** client-side validation */
    const fe = {}
    if(!isEmail(email)) fe.email = 'Email invalido'
    if(!password) fe.password = 'Requerido'
    setFieldErrors(fe)
    if(Object.keys(fe).length){ setError('Revisa los campos'); notify('Revisa los campos', 'error'); return }
    try {
      setLoading(true)
      const { data } = await userApi.login({ email, password })
      localStorage.setItem('token', data.token)
      onLogin(data.token)
      notify('Sesion iniciada', 'success')
      window.dispatchEvent(new Event('auth-changed'))
      await cart.load()
      nav('/')
    } catch (err) {
      setError('Credenciales invalidas')
      notify('Credenciales invalidas', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit} style={{maxWidth:420}} autoComplete="off">
        <FormField label="Email" error={fieldErrors.email}>
          <input type="email" name="user_email" autoComplete="email" value={email} onChange={e=>{ setEmail(e.target.value); if(fieldErrors.email) setFieldErrors(prev=> ({...prev, email: isEmail(e.target.value)? '':'Email invalido'})) }} required/>
        </FormField>
        <FormField label="Contrasena" error={fieldErrors.password}>
          <input type="password" name="user_password" autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" value={password} onChange={e=>{ setPassword(e.target.value); if(fieldErrors.password) setFieldErrors(prev=> ({...prev, password: e.target.value? '':'Requerido'})) }} required/>
        </FormField>
        {error && <p className="error">{error}</p>}
        <Button loading={loading}>Entrar</Button>
      </form>
      <p>No tienes cuenta? <Link to="/register">Registrate</Link></p>
      <p><Link to="/password-reset">Olvidaste tu contrasena?</Link></p>
    </div>
  )
}
