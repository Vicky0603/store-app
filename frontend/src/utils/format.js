export function money(v){
  const n = Number(v||0)
  return n.toLocaleString('es', { style: 'currency', currency: 'USD' })
}

