import { useState } from 'react'
import { userApi } from '../services/api.js'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const nav = useNavigate()
  const [form, setForm] = useState({firstName:'',lastName:'',shippingAddress:'',email:'',dateOfBirth:'',password:''})
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const onChange = (e)=> setForm({...form,[e.target.name]:e.target.value})
  const submit = async (e)=>{
    e.preventDefault(); setError(''); setOk('')
    try{
      await userApi.register({...form, dateOfBirth: form.dateOfBirth})
      setOk('Registro exitoso, ahora puedes iniciar sesión')
      setTimeout(()=> nav('/login'), 1200)
    }catch(err){ setError('Registro fallido: verifica datos o email existente') }
  }
  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={submit} style={{maxWidth:500}}>
        <div className="row">
          <div className="field" style={{flex:1}}><label>Nombres</label><input name="firstName" value={form.firstName} onChange={onChange} required/></div>
          <div className="field" style={{flex:1}}><label>Apellidos</label><input name="lastName" value={form.lastName} onChange={onChange} required/></div>
        </div>
        <div className="field"><label>Dirección de envío</label><textarea name="shippingAddress" value={form.shippingAddress} onChange={onChange} required/></div>
        <div className="row">
          <div className="field" style={{flex:1}}><label>Email</label><input type="email" name="email" value={form.email} onChange={onChange} required/></div>
          <div className="field" style={{flex:1}}><label>Fecha de nacimiento</label><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} required/></div>
        </div>
        <div className="field"><label>Contraseña</label><input type="password" name="password" value={form.password} onChange={onChange} required/></div>
        {error && <p style={{color:'crimson'}}>{error}</p>}
        {ok && <p style={{color:'green'}}>{ok}</p>}
        <button className="btn">Crear cuenta</button>
      </form>
    </div>
  )
}

