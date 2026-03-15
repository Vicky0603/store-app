import { useState } from 'react'
import { userApi } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'
import Button from '../components/Button.jsx'
import FormField from '../components/FormField.jsx'
import { isEmail, minLength, isAdult } from '../utils/validate.js'
import { useToast } from '../components/ToastProvider.jsx'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const nav = useNavigate()
  const [form, setForm] = useState({firstName:'',lastName:'',shippingAddress:'',email:'',dateOfBirth:'',password:''})
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { notify } = useToast()
  const validateField = (name, value)=>{
    const fe = {...fieldErrors}
    const v = value
    if(name==='email') fe.email = isEmail(v) ? '' : 'Email invalido'
    if(name==='password') fe.password = minLength(v,6) ? '' : 'Minimo 6 caracteres'
    if(name==='dateOfBirth') fe.dateOfBirth = isAdult(v) ? '' : 'Debes ser mayor de 18 anios'
    if(name==='firstName') fe.firstName = v? '' : 'Requerido'
    if(name==='lastName') fe.lastName = v? '' : 'Requerido'
    if(name==='shippingAddress') fe.shippingAddress = v? '' : 'Requerido'
    setFieldErrors(fe)
  }
  const onChange = (e)=> {
    const { name, value } = e.target
    setForm(prev => ({...prev, [name]: value}))
    validateField(name, value)
  }
  const submit = async (e)=>{
    e.preventDefault(); setError('')
    /** client-side validation */
    const errs = {}
    if(!isEmail(form.email)) errs.email = 'Email invalido'
    if(!minLength(form.password, 6)) errs.password = 'Minimo 6 caracteres'
    if(!isAdult(form.dateOfBirth)) errs.dateOfBirth = 'Debes ser mayor de 18 anios'
    if(!form.firstName) errs.firstName = 'Requerido'
    if(!form.lastName) errs.lastName = 'Requerido'
    if(!form.shippingAddress) errs.shippingAddress = 'Requerido'
    if(Object.keys(errs).length){ setFieldErrors(errs); setError('Revisa los campos marcados'); notify('Revisa los campos marcados', 'error'); return }
    try{
      setLoading(true)
      await userApi.register({...form, dateOfBirth: form.dateOfBirth})
      notify('Registro exitoso. Inicia sesion.', 'success')
      setTimeout(()=> nav('/login'), 800)
    }catch(err){ setError('Registro fallido: verifica datos o email existente'); notify('Registro fallido', 'error') }
    finally{ setLoading(false) }
  }
  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={submit} style={{maxWidth:560}} autoComplete="off">
        <div className="row">
          <FormField label="Nombres" error={fieldErrors.firstName}><input name="firstName" value={form.firstName} onChange={onChange} required/></FormField>
          <FormField label="Apellidos" error={fieldErrors.lastName}><input name="lastName" value={form.lastName} onChange={onChange} required/></FormField>
        </div>
        <FormField label="Direccion de envio" error={fieldErrors.shippingAddress}><textarea name="shippingAddress" value={form.shippingAddress} onChange={onChange} required/></FormField>
        <div className="row">
          <FormField label="Email" error={fieldErrors.email}><input type="email" name="user_email" autoComplete="email" value={form.email} onChange={onChange} required/></FormField>
          <FormField label="Fecha de nacimiento" error={fieldErrors.dateOfBirth}><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} required/></FormField>
        </div>
        <FormField label="Contrasena" error={fieldErrors.password}><input type="password" name="user_password" autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" value={form.password} onChange={onChange} required/></FormField>
        {error && <p className="error">{error}</p>}
        <Button loading={loading}>Crear cuenta</Button>
      </form>
    </div>
  )
}
