import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Heading, Seo } from '../components'
import { PageHero } from './common'
import { ProjectCard } from '../components'
import { projects } from '../data'
import { useShowcaseProjects } from '../lib/showcase.jsx'
import agencyPreview from '../assets/open-source-inspiration/agency.png'
import freelancerPreview from '../assets/open-source-inspiration/freelancer.png'
import cleanBlogPreview from '../assets/open-source-inspiration/clean-blog.png'

const cats = ['All', 'Business', 'E-Commerce', 'Portfolio', 'Restaurant', 'SaaS', 'Local Services']
const openSourceExamples = [
  {
    title: 'Agency',
    type: 'Agency / business',
    image: agencyPreview,
    preview: 'https://startbootstrap.github.io/startbootstrap-agency/',
    repository: 'https://github.com/StartBootstrap/startbootstrap-agency',
  },
  {
    title: 'Freelancer',
    type: 'Personal portfolio',
    image: freelancerPreview,
    preview: 'https://startbootstrap.github.io/startbootstrap-freelancer/',
    repository: 'https://github.com/StartBootstrap/startbootstrap-freelancer',
  },
  {
    title: 'Clean Blog',
    type: 'Blog / editorial',
    image: cleanBlogPreview,
    preview: 'https://startbootstrap.github.io/startbootstrap-clean-blog/',
    repository: 'https://github.com/StartBootstrap/startbootstrap-clean-blog',
  },
]

export function Projects() {
  const [f, setF] = useState('All')
  const { storedProjects, showcaseError } = useShowcaseProjects()
  const list = useMemo(() => projects
    .map(project => ({ ...project, ...storedProjects[project.slug], image: storedProjects[project.slug]?.image || project.imageSrc }))
    .filter(project => f === 'All' || project.cat === f), [f, storedProjects])

  return (<>
    <Seo title="Projects" desc="Demo website concepts by Logic Forge: business, e-commerce, portfolio, restaurant, SaaS and local service sites." />
    <PageHero title={<><span>Demo <span className="grad-text">Projects</span></span></>} text="Illustrative concepts, not completed client projects." />
    <section className="py-16"><div className="wrap"><div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter projects">
      {cats.map(c => <button key={c} onClick={() => setF(c)} aria-pressed={f === c} className={`rounded-full px-5 py-2 text-sm font-bold transition ${f === c ? 'bg-gradient-to-r from-cyan to-electric text-white' : 'bg-white/5 text-ink hover:bg-white/10'}`}>{c}</button>)}</div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map(p => <ProjectCard key={p.slug} p={p} />)}</div>
      {!list.length && <p className="text-center text-ink/60">No projects in this category yet.</p>}
      {showcaseError && <p role="status" className="mt-5 text-center text-xs text-ink/50">Showing the bundled UI screenshots because saved showcase images could not be loaded.</p>}
      <div className="mt-20">
        <Heading eyebrow="External references" title="Open-Source Website Inspiration" text="Independent MIT-licensed templates for design reference. These are not Logic Forge projects or client work." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {openSourceExamples.map(example => (
            <article key={example.title} className="card overflow-hidden !p-0">
              <a href={example.preview} target="_blank" rel="noreferrer" aria-label={`Open the ${example.title} live preview`}>
                <img src={example.image} alt={`${example.title} template screenshot by Start Bootstrap`} loading="lazy" className="aspect-[3/2] w-full object-cover object-top" />
              </a>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-electric">{example.type} · External MIT template</p>
                <h3 className="mt-1 text-lg font-bold">{example.title}</h3>
                <p className="mt-2 text-sm text-ink/70">Screenshot and template by Start Bootstrap.</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                  <a href={example.preview} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-electric hover:underline">
                    Live preview <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <a href={`${example.repository}/blob/master/LICENSE`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink/70 hover:text-cyan">
                    MIT license <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-ink/50">These independent examples are included for inspiration only. Visit each linked source and license for details.</p>
      </div>
    </div></section>
  </>)
}
