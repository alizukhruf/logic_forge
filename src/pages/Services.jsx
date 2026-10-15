import { Heading, Reveal, Seo, ServiceCard } from '../components'
import { FinalCta, PageHero, Process } from './common'
import { useServices } from '../lib/services.jsx'

export function Services() {
  const { activeServices } = useServices()

  return (<>
    <Seo title="Services" desc="Business websites, e-commerce, redesigns, landing pages, SEO-friendly development and support from Logic Forge." />
    <PageHero title={<><span>Services Built Around <span className="grad-text">Your Goals</span></span></>} text="From first website to full online store, everything you need to get online." />
    <section className="py-20"><div className="wrap grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{activeServices.map((s, i) => <Reveal key={s.slug} className="h-full" delay={(i % 4) * 0.06}><ServiceCard s={s} /></Reveal>)}</div></section>
    <section className="bg-white/5 py-20"><div className="wrap"><Heading title="Our Development Process" /><Process /></div></section>
    <FinalCta title="Not sure which service you need?" />
  </>)
}
