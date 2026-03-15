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

