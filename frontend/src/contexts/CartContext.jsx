import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cartApi } from '../services/api.js'

const CartCtx = createContext({
  items: [],
  count: 0,
  loading: false,
  load: async ()=>{},
  addItem: async ()=>{},
  updateQty: async ()=>{},
  removeItem: async ()=>{},
  clear: async ()=>{}
})

export function useCart(){
  return useContext(CartCtx)
}

export default function CartProvider({ children }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const storageKey = 'guest_cart'
  const hasToken = () => !!localStorage.getItem('token')
  const readGuest = () => {
    try{ return JSON.parse(localStorage.getItem(storageKey) || '[]') }catch{ return [] }
  }
  const writeGuest = (arr) => localStorage.setItem(storageKey, JSON.stringify(arr||[]))

  const load = useCallback(async ()=>{
    setLoading(true)
    if(!hasToken()){
      setItems(readGuest())
      setLoading(false)
      return
    }
    try{
      const { data } = await cartApi.get()
      setItems(data.items || [])
    } catch(_) {
      setItems([])
    } finally { setLoading(false) }
  }, [])

  const addItem = useCallback(async (payload)=>{
    if(!hasToken()){
      // merge by productId
      setItems(prev => {
        const arr = prev.length? [...prev] : readGuest()
        const idx = arr.findIndex(i => i.productId === payload.productId)
        if(idx>=0){ arr[idx] = {...arr[idx], quantity: (arr[idx].quantity||0) + (payload.quantity||1)} }
        else { arr.push({ id: Math.random(), ...payload }) }
        writeGuest(arr); return arr
      })
      return
    }
    const { data } = await cartApi.add(payload)
    setItems(data.items || [])
  }, [])

  const updateQty = useCallback(async (id, quantity)=>{
    if(!hasToken()){
      setItems(prev => { const arr = prev.length? [...prev] : readGuest(); const it = arr.find(i=> i.id===id); if(it){ it.quantity = quantity } writeGuest(arr); return arr })
      return
    }
    const { data } = await cartApi.updateQty(id, quantity)
    setItems(data.items || [])
  }, [])

  const removeItem = useCallback(async (id)=>{
    if(!hasToken()){
      setItems(prev => { const arr=(prev.length? prev : readGuest()).filter(i=> i.id!==id); writeGuest(arr); return arr })
      return
    }
    await cartApi.remove(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clear = useCallback(async ()=>{
    if(!hasToken()){
      writeGuest([])
      setItems([])
      return
    }
    await cartApi.clear()
    setItems([])
  }, [])

  const count = useMemo(()=> items.reduce((s,i)=> s + (Number(i.quantity)||0), 0), [items])

  const value = useMemo(()=> ({ items, count, loading, load, addItem, updateQty, removeItem, clear }), [items, count, loading, load, addItem, updateQty, removeItem, clear])

  useEffect(()=>{ /* eager load and auth sync */
    const handler = async ()=>{
      if(hasToken()){
        // merge guest into server
        const guest = readGuest()
        for(const g of guest){ try{ await cartApi.add(g) }catch{} }
        writeGuest([])
      }
      load()
    }
    window.addEventListener('auth-changed', handler)
    window.addEventListener('storage', (e)=>{ if(e.key==='token') handler() })
    // initial load
    handler()
    return ()=> window.removeEventListener('auth-changed', handler)
  }, [load])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}
