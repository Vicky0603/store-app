import { useEffect, useState } from 'react'
import { orderApi } from '../services/api.js'

export default function Orders(){
  const [list, setList] = useState([])
  const load = async ()=>{ const {data}= await orderApi.list(); setList(data) }
  useEffect(()=>{ load() }, [])
  return (
    <div>
      <h2>Mis ordenes</h2>
      {list.map(o=> (
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
      {!list.length && <p>No hay ordenes aun.</p>}
    </div>
  )
}
