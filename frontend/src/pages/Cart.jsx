import { useEffect, useState } from 'react'
import { cartApi } from '../services/api.js'

export default function Cart(){
  const [cart, setCart] = useState({ items: [] })
  const load = async ()=>{ const {data}= await cartApi.get(); setCart(data) }
  useEffect(()=>{ load() }, [])
  const remove = async (id)=>{ await cartApi.remove(id); load() }
  const updateQty = async (id, quantity)=>{ await cartApi.updateQty(id, quantity); load() }
  const total = cart.items?.reduce((s,i)=> s + Number(i.price)*i.quantity, 0) || 0
  return (
    <div>
      <h2>Carrito</h2>
      {cart.items?.length? cart.items.map(i=> (
        <div key={i.id} className="row" style={{alignItems:'center',background:'#fff',padding:'.5rem',marginBottom:'.5rem',border:'1px solid #eee',borderRadius:'.5rem'}}>
          <img src={i.imageUrl} alt={i.productName} style={{width:80,height:60,objectFit:'cover',borderRadius:'.25rem'}}/>
          <div style={{flex:1}}>
            <div><strong>{i.productName}</strong></div>
            <small>${Number(i.price).toFixed(2)}</small>
          </div>
          <input style={{width:70}} type="number" min="1" value={i.quantity} onChange={e=>updateQty(i.id, Number(e.target.value))}/>
          <button className="btn" onClick={()=>remove(i.id)}>Eliminar</button>
        </div>
      )) : <p>Tu carrito esta vacio</p>}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  )
}
