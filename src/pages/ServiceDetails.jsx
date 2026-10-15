import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Btn, Heading, Seo } from '../components'
import { process } from '../data'
import { useServices } from '../lib/services.jsx'
import { FinalCta } from './common'
import { NotFound } from './NotFound'

export function ServiceDetails() {
  const { slug } = useParams()
  const { activeServices } = useServices()
  const service = activeServices.find(item => item.slug === slug)

  if (!service) return <NotFound />

  const Icon = service.icon

  return (<>
    <Seo title={service.title} desc={service.text} />
    <section className="dark-bg py-16 sm:py-20">
      <div className="wrap">
        <Link to="/services" className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
          <ArrowLeft size={16} aria-hidden="true" /> All Services
        </Link>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan">Logic Forge Service</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">{service.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/75">{service.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn to={`/contact?service=${encodeURIComponent(service.title)}`}>Discuss This Service</Btn>
              <Btn to="/projects" variant="s">Explore Demo Concepts</Btn>
            </div>
          </div>
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-cyan to-electric text-white shadow-2xl shadow-electric/30 sm:h-32 sm:w-32">
            <Icon size={56} strokeWidth={1.5} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
    <section className="py-16 sm:py-20">
      <div className="wrap">
        <Heading eyebrow="Service details" title={`What’s included in ${service.title}`} text={service.details} />
        {service.features.length > 0 && <ul className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.features.map((feature, index) => (
            <li key={`${feature}-${index}`} className="card flex items-start gap-3">
              <span className="mt-1 text-sm font-extrabold text-cyan">0{index + 1}</span>
              <span className="font-semibold">{feature}</span>
            </li>
          ))}
        </ul>}
        <div className="mt-14">
          <Heading title="How the work moves forward" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <article key={step.title} className="card h-full">
                <p className="text-sm font-extrabold text-cyan">0{index + 1}</p>
                <step.icon className="my-3 text-electric" size={28} aria-hidden="true" />
                <h3 className="font-bold">{step.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
        <Link to="/contact" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-electric hover:underline">
          Have a different project in mind? Get in touch <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
    <FinalCta title={`Let's discuss your ${service.title.toLowerCase()} project`} />
  </>)
}
