import { Link } from 'react-router-dom'

export const Logo = ({ light = true }) => (
  <Link to="/" className="flex items-center gap-3" aria-label="Logic Forge home">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan to-electric text-lg font-extrabold text-white" style={{ clipPath: 'polygon(0 0,100% 0,100% 75%,75% 100%,0 100%)' }}>LF</span>
    <span className="leading-none"><span className={`block text-xl font-extrabold ${light ? 'text-white' : 'text-ink'}`}>Logic <span className="text-cyan">Forge</span></span>
      <span className={`text-[9px] tracking-[0.3em] ${light ? 'text-white/70' : 'text-ink/60'}`}>WEBSITE DEVELOPMENT</span></span>
  </Link>
)
