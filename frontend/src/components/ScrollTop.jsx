import { useEffect, useState } from 'react'

export default function ScrollTop(){
  const [show, setShow] = useState(false)
  useEffect(()=>{
    const onScroll = ()=> setShow(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return ()=> window.removeEventListener('scroll', onScroll)
  }, [])
  if(!show) return null
  return (
    <div className="scrolltop">
      <button aria-label="Scroll to top" onClick={()=> window.scrollTo({ top:0, behavior:'smooth' })}>↑</button>
    </div>
  )
}

