import { useEffect, useState } from 'react'
import { catalogApi } from '../services/api.js'
import { money } from '../utils/format.js'
import { useToast } from '../components/ToastProvider.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { productImageMap } from '../utils/productImages.js'

export default function Catalog(){
  const [q, setQ] = useState('')
  const [list, setList] = useState([])
  const [added, setAdded] = useState({})
  const [loading, setLoading] = useState(true)
  const { notify } = useToast()
  const cart = useCart()
  const load = async (query = q)=>{ setLoading(true); const {data}= await catalogApi.list(query); setList(data); setLoading(false) }
  useEffect(()=>{ load() }, [])
  // debounce search on q change
  useEffect(()=>{
    const t = setTimeout(()=>{ load(q) }, 400)
    return ()=> clearTimeout(t)
  }, [q])
  const search = (e)=>{ e.preventDefault(); /* no-op, debounce handles */ }
  const add = async (p)=>{
    try{
      const resolvedImage = (productImageMap[p.name] || p.imageUrl)
      await cart.addItem({productId:p.id, productName:p.name, imageUrl: resolvedImage, price:p.price, quantity:1})
      setAdded(prev=> ({...prev, [p.id]: true}))
      setTimeout(()=> setAdded(prev=> ({...prev, [p.id]: false})), 1200)
      notify('Producto agregado al carrito', 'success')
    } catch {
      notify('Requiere login para agregar al carrito', 'error')
    }
  }
  return (
    <div>
      <form onSubmit={search} className="row" style={{marginBottom:'1rem'}}>
        <input placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,padding:'.5rem'}}/>
        {q && <button type="button" className="btn secondary" onClick={()=>{ setQ(''); load('') }}>X</button>}
        <button className="btn secondary" type="submit">Buscar</button>
      </form>
      {loading && (
        <div className="grid">
          {Array.from({length:8}).map((_,i)=> (
            <div key={i} className="skeleton card" />
          ))}
        </div>
      )}
      <div className="grid">
        {list.map(p=> (
          <div className="card" key={p.id}>
            <img src={productImageMap[p.name] || p.imageUrl}
                 alt={p.name}
                 onError={e=>{
                   e.target.onerror=null;
                   const text = encodeURIComponent(p.name || 'Producto');
                   e.target.src = `https://placehold.co/640x480?text=${text}`;
                 }} />
            <div className="body">
              <strong>{p.name}</strong>
              <small>{p.description}</small>
              <small>Disponible: {p.quantity}</small>
              <div className="row" style={{alignItems:'center', justifyContent:'space-between'}}>
                <span>{money(p.price)}</span>
                <button className="btn" disabled={p.quantity<=0} onClick={()=>add(p)}>{p.quantity>0? (added[p.id]? 'Agregado':'Agregar'):'Agotado'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
