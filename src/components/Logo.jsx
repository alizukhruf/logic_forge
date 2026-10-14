import { Link } from 'react-router-dom'
import logo from '../assets/logic-forge-logo.png'

export const Logo = ({ light = true }) => (
  <Link to="/" className="flex items-center" aria-label="Logic Forge home">
    <img
      src={logo}
      alt="Logic Forge logo"
      className={`h-10 w-auto shrink-0 ${light ? 'drop-shadow-[0_0_16px_rgba(56,189,248,0.35)]' : ''}`}
    />
  </Link>
)
