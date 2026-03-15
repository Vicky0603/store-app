export function isEmail(v){
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function minLength(v, n){
  return (v||'').length >= n
}

export function isAdult(dateStr){
  if(!dateStr) return false
  const dob = new Date(dateStr)
  if(isNaN(dob.getTime())) return false
  const now = new Date()
  const age = now.getFullYear() - dob.getFullYear() - (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0)
  return age >= 18
}

