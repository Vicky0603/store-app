import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { aiApi } from '../services/api.js'

export default function ChatWidget(){
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const location = useLocation()
  const [messages, setMessages] = useState([{ role:'assistant', text:'Hola! Pregunta por productos y te sugiero opciones.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async ()=>{
    if(!input.trim()) return
    const q = input.trim()
    setMessages(m => [...m, { role:'user', text:q }])
    setInput(''); setLoading(true)
    try{
      const { data } = await aiApi.chat(q)
      setMessages(m => [...m, { role:'assistant', text: data?.answer || 'No tengo respuesta.' }])
    }catch{ setMessages(m => [...m, { role:'assistant', text:'Hubo un error. Intenta de nuevo.' }]) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{
    // Hide chat on mini-cart open or on checkout to avoid overlay issues
    const onOpen = ()=> { setOpen(false); setVisible(false) }
    const onClose = ()=> setVisible(true)
    window.addEventListener('mini-cart-opened', onOpen)
    window.addEventListener('mini-cart-closed', onClose)
    return ()=>{
      window.removeEventListener('mini-cart-opened', onOpen)
      window.removeEventListener('mini-cart-closed', onClose)
    }
  }, [])

  useEffect(()=>{
    // Also hide on specific routes to reduce friction
    const path = location.pathname || ''
    if (path.startsWith('/checkout')) { setOpen(false); setVisible(false) }
    else setVisible(true)
  }, [location.pathname])

  if (!visible) return null

  return (
    <div>
      <button className="btn" style={{position:'fixed',left:'1rem',bottom:'1rem',zIndex:90}} onClick={()=> setOpen(v=>!v)}>
        {open? 'Cerrar chat' : 'Asistente' }
      </button>
      {open && (
        <div style={{position:'fixed',left:'1rem',bottom:'4.5rem',width:'320px',maxWidth:'95%',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'.75rem',boxShadow:'var(--shadow)',display:'flex',flexDirection:'column',overflow:'hidden',zIndex:90}}>
          <div style={{padding:'.5rem .75rem',borderBottom:'1px solid var(--border)'}}><strong>Asistente de tienda</strong></div>
          <div style={{padding:'.5rem',maxHeight:'300px',overflow:'auto',display:'flex',flexDirection:'column',gap:'.35rem'}}>
            {messages.map((m,i)=> (
              <div key={i} style={{alignSelf: m.role==='user'?'flex-end':'flex-start', background: m.role==='user'?'#e5f0ff':'#f3f4f6', color:'#111', padding:'.4rem .6rem', borderRadius:'.5rem'}}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'.35rem',padding:'.5rem',borderTop:'1px solid var(--border)'}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} placeholder="Pregunta por un producto..." style={{flex:1,padding:'.5rem',border:'1px solid var(--border)',borderRadius:'.45rem'}}/>
            <button className="btn" onClick={send} disabled={loading}>{loading? '...' : 'Enviar'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
