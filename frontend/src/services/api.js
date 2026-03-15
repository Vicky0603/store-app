import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_GATEWAY || '' })

export function authHeaders() {
  const t = localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export const userApi = {
  register: (data) => axios.post(import.meta.env.VITE_USER_URL + '/api/auth/register', data),
  login: (data) => axios.post(import.meta.env.VITE_USER_URL + '/api/auth/login', data),
  resetInit: (data) => axios.post(import.meta.env.VITE_USER_URL + '/api/auth/password/reset/init', data),
  resetComplete: (data) => axios.post(import.meta.env.VITE_USER_URL + '/api/auth/password/reset/complete', data),
  me: () => axios.get(import.meta.env.VITE_USER_URL + '/api/profile', { headers: authHeaders() }),
  update: (payload) => axios.put(import.meta.env.VITE_USER_URL + '/api/profile', payload, { headers: authHeaders() })
}

export const catalogApi = {
  list: (q) => axios.get(import.meta.env.VITE_CATALOG_URL + '/api/products' + (q ? `?q=${encodeURIComponent(q)}` : '')),
  get: (id) => axios.get(import.meta.env.VITE_CATALOG_URL + `/api/products/${id}`)
}

export const cartApi = {
  get: () => axios.get(import.meta.env.VITE_CART_URL + '/api/cart', { headers: authHeaders() }),
  add: (item) => axios.post(import.meta.env.VITE_CART_URL + '/api/cart/items', item, { headers: authHeaders() }),
  updateQty: (id, quantity) => axios.put(import.meta.env.VITE_CART_URL + `/api/cart/items/${id}`, { quantity }, { headers: authHeaders() }),
  remove: (id) => axios.delete(import.meta.env.VITE_CART_URL + `/api/cart/items/${id}`, { headers: authHeaders() }),
  clear: () => axios.delete(import.meta.env.VITE_CART_URL + '/api/cart', { headers: authHeaders() })
}

export const orderApi = {
  confirm: (payload) => axios.post(import.meta.env.VITE_ORDER_URL + '/api/orders/confirm', payload, { headers: authHeaders() }),
  list: () => axios.get(import.meta.env.VITE_ORDER_URL + '/api/orders', { headers: authHeaders() }),
  get: (id) => axios.get(import.meta.env.VITE_ORDER_URL + `/api/orders/${id}`, { headers: authHeaders() })
}

export default api

