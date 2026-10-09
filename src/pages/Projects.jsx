import { useState } from 'react'
import { Seo } from '../components'
import { PageHero } from './common'
import { ProjectCard } from '../components'
import { projects } from '../data'

const cats = ['All', 'Business', 'E-Commerce', 'Portfolio', 'Landing Pages']

export function Projects() {
  const [f, setF] = useState('All'); const list = projects.filter(p => f === 'All' || p.cat === f)

  return (<>
    <Seo title="Projects" desc="Demo website concepts by Logic Forge: business, e-commerce, portfolio, restaurant, SaaS and local service sites." />
    <PageHero title={<><span>Demo <span className="grad-text">Projects</span></span></>} text="Illustrative concepts, not completed client projects." />
    <section className="py-16"><div className="wrap"><div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter projects">
      {cats.map(c => <button key={c} onClick={() => setF(c)} aria-pressed={f === c} className={`rounded-full px-5 py-2 text-sm font-bold transition ${f === c ? 'bg-gradient-to-r from-cyan to-electric text-white' : 'bg-white/5 text-ink hover:bg-white/10'}`}>{c}</button>)}</div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map(p => <ProjectCard key={p.slug} p={p} />)}</div>
      {!list.length && <p className="text-center text-ink/60">No projects in this category yet.</p>}</div></section>
  </>)
}
