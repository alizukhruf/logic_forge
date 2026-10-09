import { Check } from 'lucide-react'
import { Seo, Btn, Heading } from '../components'
import { FinalCta, PageHero, Process } from './common'

export function About() {
  const values = ['Quality', 'Transparency', 'Creativity', 'Performance', 'Customer Satisfaction']
  const why = ['Modern, responsive websites built with current tools', 'Clear communication and honest scoping', 'Designs tailored to your brand', 'Support available after launch']

  return (<>
    <Seo title="About" desc="Learn about Logic Forge and developer Ali Zukhruf, who builds modern websites for businesses." />
    <PageHero title={<><span>We Turn Ideas Into <span className="grad-text">Digital Experiences.</span></span></>} text="Logic Forge is a web development service focused on helping businesses establish a professional online presence." />
    <section className="py-20"><div className="wrap grid items-center gap-12 lg:grid-cols-2">
      <div className="card text-center"><div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-cyan to-electric text-4xl font-extrabold text-white" aria-label="Portrait placeholder">AZ</div>
        <h2 className="mt-4 text-2xl font-extrabold">Ali Zukhruf</h2><p className="font-semibold text-electric">Web Developer, Founder of Logic Forge</p>
        <p className="mt-3 text-sm text-ink/70">I build modern, fast and responsive websites for small businesses, startups and entrepreneurs.</p></div>
      <div><h2 className="text-3xl font-extrabold">Our Mission</h2><p className="mt-3 text-ink/75">To create useful, attractive and reliable websites that help businesses present themselves professionally and reach more customers.</p>
        <h3 className="mt-8 text-xl font-bold">Core Values</h3><div className="mt-3 flex flex-wrap gap-2">{values.map(v => <span key={v} className="rounded-full bg-white/5 px-4 py-2 text-sm font-bold text-violet-200 ring-1 ring-electric/20">{v}</span>)}</div></div></div></section>
    <section className="bg-white/5 py-20"><div className="wrap"><Heading title="Why Choose Logic Forge" />
      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">{why.map(w => <div key={w} className="card flex gap-3"><Check className="shrink-0 text-cyan" />{w}</div>)}</div>
      <div className="mt-10 flex justify-center gap-3"><Btn to="/services">Our Services</Btn><Btn to="/contact" variant="d">Contact Us</Btn></div></div></section>
    <FinalCta />
  </>)
}
