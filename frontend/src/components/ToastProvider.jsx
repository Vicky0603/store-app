import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext({ notify: () => {} })

export function useToast(){
  return useContext(ToastCtx)
}

export default function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type='info', timeout=2500)=>{
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(()=> setToasts(t => t.filter(x=> x.id !== id)), timeout)
  },[])

  const value = useMemo(()=> ({ notify }), [notify])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/** Listen for global error events to display as toasts */
if (typeof window !== 'undefined'){
  window.addEventListener('app-error', (e)=>{
    const d = e?.detail
    const msg = d?.message || 'Ocurrio un error'
    /** We cannot call hooks here; instead, create a lightweight toast element. */
    try{
      const el = document.createElement('div')
      el.className = 'toast error'
      el.textContent = msg
      const wrap = document.querySelector('.toasts') || document.body.appendChild(Object.assign(document.createElement('div'),{className:'toasts'}))
      wrap.appendChild(el)
      setTimeout(()=>{ try{ wrap.removeChild(el) }catch{} }, 2500)
    }catch{}
  })
}
