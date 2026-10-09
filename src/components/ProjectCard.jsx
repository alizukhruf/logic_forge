import { Link } from 'react-router-dom'
import { Browser } from './Browser.jsx'

export function ProjectCard({ p }) {
  return (
    <Link to={`/projects/${p.slug}`} className="card group block !p-4">
      <Browser title={p.name} g={p.g} className="transition group-hover:scale-[1.02]" />
      <div className="mt-4 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-electric">{p.cat}</span><span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-ink/60">DEMO PROJECT</span></div>
      <h3 className="mt-1 text-lg font-bold">{p.name}</h3><p className="mt-1 text-sm text-ink/70">{p.desc}</p>
      <p className="mt-2 text-xs text-ink/50">{p.tech.join(' · ')}</p><span className="mt-3 inline-block text-sm font-bold text-electric">View Details →</span>
    </Link>
  )
}
