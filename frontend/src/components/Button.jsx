export default function Button({ children, variant='primary', loading=false, disabled, ...props }){
  const className = `btn ${variant}`
  return (
    <button className={className} disabled={disabled || loading} {...props}>
      {loading ? <span className="spinner" /> : children}
    </button>
  )
}

