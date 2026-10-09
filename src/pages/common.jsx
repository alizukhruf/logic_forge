import { Btn, Reveal } from '../components'
import { process } from '../data'

export const Process = ({ dark }) => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{process.map((s, i) => (
    <Reveal key={s.title} delay={i * 0.08}><div className="card h-full"><span className="text-sm font-extrabold text-cyan">0{i + 1}</span>
      <s.icon className="my-3 text-electric" size={28} /><h3 className="font-bold">{s.title}</h3><p className="mt-1 text-sm text-ink/70">{s.text}</p></div></Reveal>))}</div>
)

export const FinalCta = ({ title = 'Ready to Build Your Online Presence?' }) => (
  <section className="dark-bg py-20 text-center"><div className="wrap"><h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">{title}</h2>
    <p className="mx-auto mt-3 max-w-xl text-white/70">Tell me about your idea and let's bring it online.</p>
    <div className="mt-8"><Btn to="/contact">Let's Build Your Website</Btn></div></div></section>
)

export const PageHero = ({ title, text }) => (
  <section className="dark-bg py-20"><div className="wrap"><h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1>{text && <p className="mt-4 max-w-2xl text-lg text-white/70">{text}</p>}</div></section>
)
