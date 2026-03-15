import { useEffect, useState } from 'react'
import { userApi } from '../services/api.js'

export default function Profile(){
  const [profile, setProfile] = useState(null)
  const [ok, setOk] = useState('')
  useEffect(()=>{(async()=>{ const {data}= await userApi.me(); setProfile(data) })()},[])
  const save = async ()=>{
    await userApi.update(profile); setOk('Perfil actualizado'); setTimeout(()=> setOk(''), 1200)
  }
  if (!profile) return <p>Cargando...</p>
  return (
    <div>
      <h2>Perfil</h2>
      <div className="row">
        <div className="field" style={{flex:1}}><label>Nombres</label><input value={profile.firstName} onChange={e=>setProfile({...profile, firstName:e.target.value})}/></div>
        <div className="field" style={{flex:1}}><label>Apellidos</label><input value={profile.lastName} onChange={e=>setProfile({...profile, lastName:e.target.value})}/></div>
      </div>
      <div className="field"><label>Direccion de envio</label><textarea value={profile.shippingAddress} onChange={e=>setProfile({...profile, shippingAddress:e.target.value})}/></div>
      <div className="field"><label>Email</label><input disabled value={profile.email}/></div>
      <button className="btn" onClick={save}>Guardar</button>
      {ok && <p style={{color:'green'}}>{ok}</p>}
    </div>
  )
}
