import { useState } from 'react'
import { Seo, Btn, Heading, Reveal, Devices, Marquee, ProjectCard } from '../components'
import { benefits, services, projects } from '../data'
import { FinalCta, Process } from './common'

export function Home() {
  return (<>
    <Seo title="Web Development Agency" desc="Logic Forge builds modern, fast, responsive websites that help businesses grow and get more customers." />
    <section className="dark-bg overflow-hidden"><div className="wrap grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
      <div><span className="glass mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-widest text-cyan">DESIGN · DEVELOP · LAUNCH</span>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Turn Your Business Into a Powerful <span className="grad-text">Online Presence.</span></h1>
        <p className="mt-5 max-w-lg text-lg text-white/75">I'm a web developer, and I build modern, fast, responsive websites that help businesses grow and get more customers.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Btn to="/contact">Let's Build Your Website</Btn><Btn to="/services" variant="s">Explore Our Services</Btn></div>
        <p className="mt-8 -rotate-2 font-hand text-3xl text-cyan">Your Vision, Our Code, Real Results.</p>
        <div className="mt-8 grid max-w-md grid-cols-3 gap-3">{[0, 1, 3].map(i => { const b = benefits[i]; return <div key={b.title} className="glass rounded-2xl p-3 text-center text-xs font-semibold"><b.icon className="mx-auto mb-1 text-cyan" size={22} />{b.title}</div> })}</div></div>
      <Devices /></div></section>
    <Marquee items={[...services.map(s => s.title), 'React', 'Tailwind CSS', 'Vite', 'Framer Motion']} />
    <section className="bg-white/5 py-20"><div className="wrap"><Heading eyebrow="Why Logic Forge" title="Built for Growth" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{benefits.map((b, i) => <Reveal key={b.title} delay={i * 0.05}><div className="card flex gap-4 h-full">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan to-electric text-white"><b.icon size={22} /></span>
        <div><h3 className="font-bold">{b.title}</h3><p className="text-sm text-ink/70">{b.text}</p></div></div></Reveal>)}</div></div></section>
    <section className="py-20"><div className="wrap"><Heading eyebrow="Featured Work" title="Demo Project Concepts" text="Illustrative concepts showing the kind of websites I build." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{projects.slice(0, 4).map(p => <ProjectCard key={p.slug} p={p} />)}</div>
      <div className="mt-10 text-center"><Btn to="/projects" variant="d">View All Projects</Btn></div></div></section>
    <section className="bg-white/5 py-20"><div className="wrap"><Heading eyebrow="How It Works" title="Discover. Design. Develop. Launch." /><Process /></div></section>
    <FinalCta />
  </>)
}
