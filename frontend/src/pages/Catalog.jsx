import { useEffect, useState } from 'react'
import { catalogApi, cartApi } from '../services/api.js'
import { money } from '../utils/format.js'

export default function Catalog(){
  const [q, setQ] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const load = async ()=>{ setLoading(true); const {data}= await catalogApi.list(q); setList(data); setLoading(false) }
  useEffect(()=>{ load() }, [])
  const search = (e)=>{ e.preventDefault(); load() }
  const add = async (p)=>{
    try{ await cartApi.add({productId:p.id, productName:p.name, imageUrl:p.imageUrl, price:p.price, quantity:1}); alert('Agregado al carrito') }
    catch { alert('Requiere login para agregar al carrito') }
  }
  return (
    <div>
      <form onSubmit={search} className="row" style={{marginBottom:'1rem'}}>
        <input placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,padding:'.5rem'}}/>
        <button className="btn">Buscar</button>
      </form>
      {loading && <p>Cargando catálogo...</p>}
      <div className="grid">
        {list.map(p=> (
          <div className="card" key={p.id}>
            <img src={p.imageUrl} alt={p.name} />
            <div className="body">
              <strong>{p.name}</strong>
              <small>{p.description}</small>
              <small>Disponible: {p.quantity}</small>
              <div className="row" style={{alignItems:'center', justifyContent:'space-between'}}>
                <span>{money(p.price)}</span>
                <button className="btn" disabled={p.quantity<=0} onClick={()=>add(p)}>{p.quantity>0? 'Agregar':'Agotado'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
