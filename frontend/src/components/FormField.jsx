export default function FormField({ label, error, children }){
  return (
    <div className={`field ${error ? 'invalid' : ''}`}>
      {label && <label>{label}</label>}
      {children}
      {error && <div className="helper error-text">{error}</div>}
    </div>
  )
}

