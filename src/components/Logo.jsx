import { Link } from 'react-router-dom'

export const Logo = ({ light = true }) => (
  <Link to="/" className="flex items-center gap-2.5" aria-label="Logic Forge home">
    <img
      src={`${import.meta.env.BASE_URL}logic-forge-mark.png`}
      alt=""
      className={`logo-mark h-12 w-auto shrink-0 object-contain sm:h-14 ${light ? 'drop-shadow-[0_0_18px_rgba(56,189,248,0.42)]' : ''}`}
    />
    <span className="brand-wordmark text-xl sm:text-2xl">Logic Forge</span>
  </Link>
)
