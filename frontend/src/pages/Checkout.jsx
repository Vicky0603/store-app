import { useEffect, useState } from 'react'
import { cartApi, orderApi, userApi } from '../services/api.js'
import Button from '../components/Button.jsx'
import FormField from '../components/FormField.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const [cart, setCart] = useState({ items: [] })
  const [profile, setProfile] = useState(null)
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(null)
  const [placing, setPlacing] = useState(false)
  const { notify } = useToast()
  const [addrErr, setAddrErr] = useState('')
  const nav = useNavigate()

  useEffect(()=>{(async()=>{
    const [{data:cartData},{data:me}] = await Promise.all([cartApi.get(), userApi.me()])
    setCart(cartData); setProfile(me); setAddress(me.shippingAddress)
    if(!me.shippingAddress) setAddrErr('Direccion requerida')
  })()},[])

  const confirm = async ()=>{
    if(!address){ setAddrErr('Direccion requerida'); return }
    const payload = { overrideShippingAddress: address, items: cart.items.map(i=>({
      productId:i.productId, productName:i.productName, imageUrl:i.imageUrl, price:i.price, quantity:i.quantity
    })) }
    setPlacing(true)
    const { data } = await orderApi.confirm(payload)
    await cartApi.clear()
    window.dispatchEvent(new Event('cart-updated'))
    setResult(data)
    setPlacing(false)
    notify('Pedido confirmado', 'success')
  }

  if (result) return (
    <div>
      <h2>Pedido confirmado</h2>
      <p>Numero de orden: <strong>{result.orderNumber}</strong></p>
      <p>Total: ${Number(result.total).toFixed(2)}</p>
      <button className="btn" onClick={()=> nav('/orders')}>Ver mis órdenes</button>
    </div>
  )

  const total = cart.items?.reduce((s,i)=> s + Number(i.price)*i.quantity, 0) || 0
  return (
    <div>
      <h2>Confirmar pedido</h2>
      {profile && (
        <FormField label="Direccion de envio" error={addrErr}>
          <textarea value={address} onChange={e=>{ const v=e.target.value; setAddress(v); setAddrErr(v? '':'Direccion requerida') }} onBlur={()=>{ if(!address) setAddrErr('Direccion requerida') }} />
        </FormField>
      )}
      <h3>Resumen</h3>
      {cart.items?.map(i=> (
        <div key={i.id} className="row" style={{justifyContent:'space-between'}}>
          <span>{i.productName} x {i.quantity}</span>
          <span>${(Number(i.price)*i.quantity).toFixed(2)}</span>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <Button onClick={confirm} loading={placing} disabled={!cart.items?.length}>Confirmar</Button>
    </div>
  )
}
