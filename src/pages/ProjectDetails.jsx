import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Seo, Browser, Devices, ProjectCard } from '../components'
import { projects } from '../data'
import { FinalCta } from './common'
import { NotFound } from './NotFound'

export function ProjectDetails() {
  const { slug } = useParams(); const p = projects.find(x => x.slug === slug)
  if (!p) return <NotFound />

  const List = ({ t, items }) => <div className="card"><h3 className="mb-3 font-bold">{t}</h3><ul className="space-y-2 text-sm">{items.map(i => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-cyan" />{i}</li>)}</ul></div>

  return (<>
    <Seo title={p.name} desc={`${p.name}: ${p.desc} (demo concept by Logic Forge)`} />
    <section className="dark-bg py-16"><div className="wrap"><Link to="/projects" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"><ArrowLeft size={16} />Back to Projects</Link>
      <p className="text-sm font-bold uppercase tracking-widest text-cyan">{p.cat} · Demo Project</p><h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{p.name}</h1>
      <div className="mt-10 max-w-3xl"><Browser title={p.name} g={p.g} /></div></div></section>
    <section className="py-16"><div className="wrap"><h2 className="text-2xl font-extrabold">Overview</h2><p className="mt-2 max-w-2xl text-ink/75">{p.desc} This is an illustrative demo concept, not a completed client project.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3"><List t="Design Goals" items={p.goals} /><List t="Main Features" items={p.features} /><List t="Technologies" items={p.tech} /></div>
      <h2 className="mt-14 text-2xl font-extrabold">Responsive Preview</h2><div className="mt-6"><Devices title={p.name} /></div></div></section>
    <FinalCta title="Want something similar for your business?" />
  </>)
}
