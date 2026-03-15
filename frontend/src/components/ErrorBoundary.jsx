import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(){ return { hasError: true } }
  componentDidCatch(error, info){
    try{
      const evt = new CustomEvent('app-error', { detail: { message: error?.message || 'UI error' } })
      window.dispatchEvent(evt)
      console.error('ErrorBoundary', error, info)
    }catch{}
  }
  render(){
    if(this.state.hasError){
      return <div className="error">Se produjo un error. Intenta recargar la pagina.</div>
    }
    return this.props.children
  }
}

