import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import CartProvider from './contexts/CartContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import MiniCart from './components/MiniCart.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <ErrorBoundary>
            <App />
            <MiniCart />
          </ErrorBoundary>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
