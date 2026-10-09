import { Link } from 'react-router-dom'

export function Btn({ to, href, variant = 'p', children, ...p }) {
  const c = `btn btn-${variant}`
  return to ? <Link to={to} className={c} {...p}>{children}</Link> : <a href={href} className={c} {...p}>{children}</a>
}
