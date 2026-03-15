import { useState } from 'react'
import { userApi } from '../services/api.js'

export default function PasswordReset(){
  const [step, setStep] = useState('init') // init | complete
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const init = async (e)=>{
    e.preventDefault(); setMsg(''); setError('')
    try{ const {data} = await userApi.resetInit({ email }); setMsg('Token generado. Revisa tu email. (Demo: token abajo)'); setToken(data.resetToken); setStep('complete') }catch{ setError('No se pudo iniciar el reset') }
  }

  const complete = async (e)=>{
    e.preventDefault(); setMsg(''); setError('')
    try{ await userApi.resetComplete({ token, newPassword }); setMsg('Contraseña actualizada. Ya puedes iniciar sesión.') }catch{ setError('No se pudo completar el reset') }
  }

  return (
    <div>
      <h2>Recuperar contrasena</h2>
      {step === 'init' && (
        <form onSubmit={init} style={{maxWidth:400}}>
          <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          {error && <p style={{color:'crimson'}}>{error}</p>}
          {msg && <p style={{color:'green'}}>{msg}</p>}
          <button className="btn">Enviar enlace</button>
        </form>
      )}
      {step === 'complete' && (
        <form onSubmit={complete} style={{maxWidth:400}}>
          <div className="field"><label>Token (demo)</label><input value={token} onChange={e=>setToken(e.target.value)} required/></div>
          <div className="field"><label>Nueva contrasena</label><input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/></div>
          {error && <p style={{color:'crimson'}}>{error}</p>}
          {msg && <p style={{color:'green'}}>{msg}</p>}
          <button className="btn">Cambiar contraseña</button>
        </form>
      )}
    </div>
  )
}
