import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Seo, Devices } from '../components'
import { projects } from '../data'
import { useShowcaseProjects } from '../lib/showcase.jsx'
import { FinalCta } from './common'
import { NotFound } from './NotFound'

function DetailList({ title, items }) {
  return (
    <div className="card">
      <h3 className="mb-3 font-bold">{title}</h3>
      <ul className="space-y-2 text-sm">
        {items.map(item => <li key={item} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-cyan" />{item}</li>)}
      </ul>
    </div>
  )
}

export function ProjectDetails() {
  const { slug } = useParams()
  const baseProject = projects.find(x => x.slug === slug)
  const { storedProjects, showcaseError } = useShowcaseProjects()

  if (!baseProject) return <NotFound />
  const p = { ...baseProject, ...storedProjects[slug] }

  return (<>
    <Seo title={p.name} desc={`${p.name}: ${p.desc} (demo concept by Logic Forge)`} />
    <section className="dark-bg py-16"><div className="wrap"><Link to="/projects" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"><ArrowLeft size={16} />Back to Projects</Link>
      <p className="text-sm font-bold uppercase tracking-widest text-cyan">{p.cat} · Demo Project</p><h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{p.name}</h1>
      <div className="mt-10 aspect-[16/10] max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl">
        <img src={p.image || p.imageSrc} alt={p.imageAlt} className="h-full w-full object-contain" />
      </div>
      <p className="mt-3 text-xs text-white/60">Original illustrative website screenshot concept; not a completed client project.</p>
      {showcaseError && <p role="status" className="mt-1 text-xs text-white/50">Showing the bundled UI screenshot because saved showcase images could not be loaded.</p>}
    </div></section>
    <section className="py-16"><div className="wrap"><h2 className="text-2xl font-extrabold">Overview</h2><p className="mt-2 max-w-2xl text-ink/75">{p.desc} This is an illustrative demo concept, not a completed client project.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3"><DetailList title="Design Goals" items={p.goals} /><DetailList title="Main Features" items={p.features} /><DetailList title="Technologies" items={p.tech} /></div>
      <h2 className="mt-14 text-2xl font-extrabold">Responsive Preview</h2><div className="mt-6"><Devices title={p.name} /></div></div></section>
    <FinalCta title="Want something similar for your business?" />
  </>)
}
