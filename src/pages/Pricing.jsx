import { Seo, PricingCard } from '../components'
import { PageHero } from './common'
import { Btn, Heading } from '../components'
import { pricing, faqs } from '../data'

export function Pricing() {
  return (<>
    <Seo title="Pricing" desc="Starting-estimate website packages from Logic Forge, in PKR. Final quotes depend on project scope." />
    <PageHero title={<><span>Simple, Flexible <span className="grad-text">Pricing</span></span></>} text="Starting estimates subject to project scope. Hosting, domains, paid plugins, third-party subscriptions and maintenance are not included unless explicitly agreed." />
    <section className="py-20"><div className="wrap grid items-stretch gap-8 lg:grid-cols-3">{pricing.map(t => <PricingCard key={t.name} t={t} />)}</div>
      <div className="wrap mt-14 text-center"><p className="mb-4 font-semibold">Need something different?</p><Btn to="/contact">Request a Custom Quote</Btn></div></section>
    <section className="bg-white/5 py-20"><div className="wrap max-w-3xl"><Heading title="Pricing FAQ" />
      <div className="space-y-3">{faqs.map(([q, a]) => <details key={q} className="card !p-5"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-ink/70">{a}</p></details>)}</div></div></section>
  </>)
}
