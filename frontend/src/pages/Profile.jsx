import { useEffect, useState } from 'react'
import { userApi } from '../services/api.js'
import Button from '../components/Button.jsx'
import FormField from '../components/FormField.jsx'
import Spinner from '../components/Spinner.jsx'
import { useToast } from '../components/ToastProvider.jsx'

export default function Profile(){
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errs, setErrs] = useState({})
  const { notify } = useToast()
  useEffect(()=>{(async()=>{ const {data}= await userApi.me(); setProfile(data) })()},[])
  const validate = (p)=>{
    const e = {}
    if(!p.firstName) e.firstName = 'Requerido'
    if(!p.lastName) e.lastName = 'Requerido'
    if(!p.shippingAddress) e.shippingAddress = 'Requerido'
    setErrs(e)
    return e
  }
  const save = async ()=>{
    const e = validate(profile)
    if(Object.keys(e).length){ notify('Revisa los campos marcados', 'error'); return }
    setSaving(true)
    await userApi.update(profile)
    setSaving(false)
    notify('Perfil actualizado', 'success')
  }
  if (!profile) return <div className="row" style={{gap:'.5rem'}}>
    <span className="skeleton line" style={{width:'30%'}}></span>
    <span className="skeleton line" style={{width:'20%'}}></span>
  </div>
  return (
    <div>
      <h2>Perfil</h2>
      <div className="row">
        <FormField label="Nombres" error={errs.firstName}><input value={profile.firstName} onChange={e=>{ const p={...profile, firstName:e.target.value}; setProfile(p); validate(p) }}/></FormField>
        <FormField label="Apellidos" error={errs.lastName}><input value={profile.lastName} onChange={e=>{ const p={...profile, lastName:e.target.value}; setProfile(p); validate(p) }}/></FormField>
      </div>
      <FormField label="Direccion de envio" error={errs.shippingAddress}><textarea value={profile.shippingAddress} onChange={e=>{ const p={...profile, shippingAddress:e.target.value}; setProfile(p); validate(p) }}/></FormField>
      <FormField label="Email"><input disabled value={profile.email}/></FormField>
      <Button loading={saving} onClick={save}>Guardar</Button>
    </div>
  )
}
