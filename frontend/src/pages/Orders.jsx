import { useEffect, useState } from 'react'
import { orderApi } from '../services/api.js'
import { useLocation } from 'react-router-dom'

export default function Orders(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const load = async ()=>{
    setLoading(true)
    try {
      const {data}= await orderApi.list()
      const arr = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : [])
      setList(arr)
    } catch {
      setList([])
    } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])
  useEffect(()=>{ load() }, [location.key, location.search])
  useEffect(()=>{
    const handler = ()=> load()
    window.addEventListener('order-confirmed', handler)
    return ()=> window.removeEventListener('order-confirmed', handler)
  }, [])
  return (
    <div>
      <h2>Mis ordenes</h2>
      {loading && (
        <div style={{display:'grid',gap:'.75rem'}}>
          {Array.from({length:4}).map((_,i)=> (
            <div key={i} className="card" style={{padding:'.75rem'}}>
              <div className="skeleton line" style={{width:'40%'}}/>
              <div className="skeleton line" style={{width:'25%',marginTop:'.5rem'}}/>
              <div className="skeleton line" style={{width:'80%',marginTop:'.8rem'}}/>
            </div>
          ))}
        </div>
      )}
      {(Array.isArray(list) ? list : []).map(o=> (
        <div key={o.id} className="card" style={{padding:'.75rem'}}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <strong>Orden #{o.orderNumber}</strong>
            <span>{o.status}</span>
          </div>
          <small>{new Date(o.createdAt).toLocaleString()}</small>
          <ul>
            {o.items.map(oi=> <li key={oi.id}>{oi.productName} x {oi.quantity} - ${Number(oi.price).toFixed(2)}</li>)}
          </ul>
          <strong>Total: ${Number(o.total).toFixed(2)}</strong>
        </div>
      ))}
      {!list.length && !loading && <p>No hay ordenes aun.</p>}
    </div>
  )
}
