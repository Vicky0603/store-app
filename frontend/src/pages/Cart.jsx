import { useEffect, useState } from 'react'
// import { cartApi } from '../services/api.js'
import FormField from '../components/FormField.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { productImageMap } from '../utils/productImages.js'
import Button from '../components/Button.jsx'
import { useNavigate } from 'react-router-dom'
import { money } from '../utils/format.js'

export default function Cart(){
  const cartCtx = useCart()
  const [qErr, setQErr] = useState({})
  const { notify } = useToast()
  const nav = useNavigate()
  useEffect(()=>{ cartCtx.load() }, [])
  const remove = async (id)=>{ await cartCtx.removeItem(id); notify('Item eliminado', 'info') }
  const updateQty = async (id, quantity)=>{
    if(!quantity || quantity < 1){ setQErr(prev=> ({...prev, [id]:'Min 1'})); return }
    setQErr(prev=> ({...prev, [id]:''}))
    await cartCtx.updateQty(id, quantity)
  }
  const total = (cartCtx.items||[]).reduce((s,i)=> s + Number(i.price)*i.quantity, 0) || 0
  return (
    <div>
      <h2>Carrito</h2>
      {cartCtx.items?.length? cartCtx.items.map(i=> (
        <div key={i.id} className="row" style={{alignItems:'center',background:'#fff',padding:'.5rem',marginBottom:'.5rem',border:'1px solid #eee',borderRadius:'.5rem'}}>
          <img src={productImageMap[i.productName] || i.imageUrl}
               alt={i.productName}
               style={{width:80,height:60,objectFit:'cover',borderRadius:'.25rem'}}
               onError={e=>{ e.target.onerror=null; const text=encodeURIComponent(i.productName||'Producto'); e.target.src=`https://placehold.co/160x120?text=${text}`}}
          />
          <div style={{flex:1}}>
            <div><strong>{i.productName}</strong></div>
            <small>${Number(i.price).toFixed(2)}</small>
          </div>
          <div style={{width:120}}>
            <FormField label="Cantidad" error={qErr[i.id]}>
              <input style={{width:80}} type="number" min="1" value={i.quantity} onChange={e=>updateQty(i.id, Number(e.target.value))}/>
            </FormField>
          </div>
          <button className="btn" onClick={()=>remove(i.id)}>Eliminar</button>
        </div>
      )) : <p>Tu carrito esta vacio</p>}
      <div className="row" style={{justifyContent:'space-between',alignItems:'center',marginTop:'1rem'}}>
        <h3>Total: {money(total)}</h3>
        <Button onClick={()=> nav('/checkout')} disabled={!cartCtx.items?.length}>Ir a Checkout</Button>
      </div>
    </div>
  )
}
