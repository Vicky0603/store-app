import { useEffect, useState } from 'react'
import { cartApi, orderApi, userApi } from '../services/api.js'
import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const [cart, setCart] = useState({ items: [] })
  const [profile, setProfile] = useState(null)
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(null)
  const nav = useNavigate()

  useEffect(()=>{(async()=>{
    const [{data:cartData},{data:me}] = await Promise.all([cartApi.get(), userApi.me()])
    setCart(cartData); setProfile(me); setAddress(me.shippingAddress)
  })()},[])

  const confirm = async ()=>{
    const payload = { overrideShippingAddress: address, items: cart.items.map(i=>({
      productId:i.productId, productName:i.productName, imageUrl:i.imageUrl, price:i.price, quantity:i.quantity
    })) }
    const { data } = await orderApi.confirm(payload)
    await cartApi.clear()
    setResult(data)
  }

  if (result) return (
    <div>
      <h2>Pedido confirmado</h2>
      <p>Número de orden: <strong>{result.orderNumber}</strong></p>
      <p>Total: ${Number(result.total).toFixed(2)}</p>
      <button className="btn" onClick={()=> nav('/orders')}>Ver mis órdenes</button>
    </div>
  )

  const total = cart.items?.reduce((s,i)=> s + Number(i.price)*i.quantity, 0) || 0
  return (
    <div>
      <h2>Confirmar pedido</h2>
      {profile && (
        <div className="field">
          <label>Dirección de envío</label>
          <textarea value={address} onChange={e=>setAddress(e.target.value)} />
        </div>
      )}
      <h3>Resumen</h3>
      {cart.items?.map(i=> (
        <div key={i.id} className="row" style={{justifyContent:'space-between'}}>
          <span>{i.productName} x {i.quantity}</span>
          <span>${(Number(i.price)*i.quantity).toFixed(2)}</span>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <button className="btn" onClick={confirm} disabled={!cart.items?.length}>Confirmar</button>
    </div>
  )
}

