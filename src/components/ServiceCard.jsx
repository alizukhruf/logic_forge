import { Link } from 'react-router-dom'

export function ServiceCard({ s }) {
  return (
    <div className="card flex flex-col"><span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan to-electric text-white"><s.icon size={24} /></span>
      <h3 className="text-lg font-bold">{s.title}</h3><p className="mt-2 flex-1 text-sm text-ink/70">{s.text}</p>
      <div className="mt-4 flex items-center justify-between text-sm font-bold"><Link to="/services" className="text-electric hover:underline">Learn More</Link>
        <Link to="/contact" className="text-ink/60 hover:text-cyan">Get a quote →</Link></div>
    </div>
  )
}
