import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../contexts/CartContext.jsx'
import Button from './Button.jsx'
import { money } from '../utils/format.js'
import { productImageMap } from '../utils/productImages.js'
import { useNavigate } from 'react-router-dom'
import { catalogApi } from '../services/api.js'

export default function MiniCart(){
  const { items, count, removeItem, updateQty, addItem } = useCart()
  const [open, setOpen] = useState(() => {
    try{ return localStorage.getItem('mini_cart_open') === '1' }catch{ return false }
  })
  const nav = useNavigate()
  const total = (items||[]).reduce((s,i)=> s + Number(i.price)*i.quantity, 0)
  const shipping = total >= 100 ? 0 : (items?.length ? 5.99 : 0)
  const firstItem = items?.[0]
  const [related, setRelated] = useState([])

  useEffect(()=>{
    const handler = ()=> setOpen(v => !v)
    window.addEventListener('toggle-mini-cart', handler)
    return ()=> window.removeEventListener('toggle-mini-cart', handler)
  }, [])

  useEffect(()=>{
    try{ localStorage.setItem('mini_cart_open', open ? '1' : '0') }catch{}
    try{
      window.dispatchEvent(new Event(open ? 'mini-cart-opened' : 'mini-cart-closed'))
    }catch{}
  }, [open])

  useEffect(()=>{ (async()=>{
    try{
      if (firstItem?.productId){
        const { data } = await catalogApi.related(firstItem.productId, 3)
        setRelated(data)
      } else setRelated([])
    }catch{ setRelated([]) }
  })() }, [firstItem?.productId])

  const goCheckout = ()=>{ setOpen(false); nav('/checkout') }

  return (
    <div className={`drawer ${open? 'open':''}`} aria-hidden={!open}>
      <div className="drawer-panel">
        <div className="drawer-header">
          <strong>Carrito</strong>
          <button className="btn secondary" onClick={()=> setOpen(false)}>Cerrar</button>
        </div>
        <div className="drawer-body">
          {items?.length? items.map(i=> (
            <div key={i.id} className="drawer-item">
              <img src={productImageMap[i.productName] || i.imageUrl} alt={i.productName} onError={e=>{ e.currentTarget.src = `https://placehold.co/80x60?text=${encodeURIComponent(i.productName||'Producto')}` }} />
              <div className="info">
                <div className="name">{i.productName}</div>
                <div className="sub">{money(i.price)} x {i.quantity}</div>
              </div>
              <div className="actions">
                <button className="btn secondary" onClick={()=> updateQty(i.id, Math.max(1, i.quantity-1))}>-</button>
                <button className="btn secondary" onClick={()=> updateQty(i.id, i.quantity+1)}>+</button>
                <button className="btn danger" onClick={()=> removeItem(i.id)}>Eliminar</button>
              </div>
            </div>
          )) : <p>Tu carrito esta vacio</p>}
        </div>
        <div className="drawer-footer">
          <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
            <span>Subtotal</span>
            <strong>{money(total)}</strong>
          </div>
          <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
            <span>Envio estimado</span>
            <strong>{shipping === 0 ? 'Gratis' : money(shipping)}</strong>
          </div>
          <div className="row" style={{justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'.5rem'}}>
            <span>Total estimado</span>
            <strong>{money(total + shipping)}</strong>
          </div>
          <div className="row" style={{justifyContent:'space-between'}}>
            <Button variant="secondary" onClick={()=> { setOpen(false); nav('/') }}>Seguir comprando</Button>
            <Button disabled={!items?.length} onClick={goCheckout}>Ir a Checkout</Button>
          </div>
          {!!related.length && (
            <div style={{marginTop:'.5rem'}}>
              <div className="row" style={{justifyContent:'space-between',alignItems:'center'}}>
                <strong>Te puede interesar</strong>
              </div>
              <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:'.5rem'}}>
                {related.map(r => (
                  <div key={r.id} className="card" style={{borderRadius:'.5rem'}}>
                    <img src={productImageMap[r.name] || r.imageUrl} alt={r.name} />
                    <div className="body">
                      <small>{r.name}</small>
                      <small>{money(r.price)}</small>
                      <Button variant="secondary" onClick={()=> addItem({ productId:r.id, productName:r.name, imageUrl: (productImageMap[r.name] || r.imageUrl), price:r.price, quantity:1 })}>Agregar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="drawer-backdrop" onClick={()=> setOpen(false)} />
    </div>
  )
}
