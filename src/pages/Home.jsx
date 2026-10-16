import { ArrowRight, ArrowUpRight, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Btn, Devices, Heading, Marquee, PricingCard, ProjectCard, Reveal, Seo, ServiceCard } from '../components'
import { benefits, faqs, pricing, projects } from '../data'
import { useServices } from '../lib/services.jsx'
import { useShowcaseProjects } from '../lib/showcase.jsx'
import { FinalCta, Process } from './common'

export function Home() {
  const { activeServices } = useServices()
  const { storedProjects } = useShowcaseProjects()
  const businessProject = projects.find(project => project.slug === 'business-website')
  const businessScreenshot = storedProjects['business-website']?.image || businessProject?.imageSrc
  const businessScreenshotAlt = storedProjects['business-website']?.imageAlt || businessProject?.imageAlt

  return (
    <>
      <Seo
        title="Web Development for Growing Businesses"
        desc="Logic Forge helps businesses build modern websites, responsive web applications, and digital experiences designed to turn visitors into customers."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Logic Forge',
          url: 'https://logic-forge-eosin.vercel.app/',
          logo: 'https://logic-forge-eosin.vercel.app/logic-forge-mark.png',
          email: 'alizukhruf07@gmail.com',
        }}
      />
      <section className="dark-bg overflow-hidden">
        <div className="wrap grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="glass mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-widest text-cyan">DESIGN · DEVELOP · LAUNCH</span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Build Digital Experiences That <span className="grad-text">Grow Your Business.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/75">
              Logic Forge helps businesses build modern websites, responsive web applications, and digital experiences designed to turn visitors into customers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn to="/contact">Get a Free Quote</Btn>
              <Btn to="/projects" variant="s">View Our Work</Btn>
            </div>
            <p className="mt-5 text-sm text-white/55">Clear scope, responsive design, and a practical path from first conversation to launch.</p>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[0, 1, 3].map(index => {
                const benefit = benefits[index]
                return (
                  <div key={benefit.title} className="glass rounded-2xl p-3 text-center text-xs font-semibold">
                    <benefit.icon className="mx-auto mb-1 text-cyan" size={22} aria-hidden="true" />
                    {benefit.title}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <Link
              to="/admin/login"
              aria-label="Admin Portal Dashboard"
              className="glass glow-border admin-portal-motion relative isolate mb-4 ml-auto flex w-[260px] items-center gap-3 rounded-2xl !border-white/20 px-3 py-3 text-left text-white/85 transition hover:text-white focus-visible:outline-cyan lg:absolute lg:right-0 lg:top-[-5rem] lg:z-10 lg:mb-0"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan/10 text-cyan">
                <LockKeyhole size={19} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold uppercase tracking-wider text-cyan">Admin Portal</span>
                <span className="mt-0.5 block text-lg font-bold leading-tight text-white">Dashboard</span>
              </span>
              <ArrowUpRight size={19} aria-hidden="true" className="shrink-0 text-white/75" />
            </Link>
            <Devices
              title="Corporate Business Website"
              image={businessScreenshot}
              imageAlt={businessScreenshotAlt || 'Business website screenshot concept'}
            />
            <p className="mt-3 text-center text-xs text-white/50">Illustrative website concept, not a completed client project.</p>
          </div>
        </div>
      </section>

      <Marquee items={[...activeServices.map(service => service.title), 'React', 'Tailwind CSS', 'Responsive Design']} />

      <section className="py-20">
        <div className="wrap">
          <Heading eyebrow="What we do" title="Core Services" text="Practical web design and development for businesses building or improving their online presence." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeServices.slice(0, 3).map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05}><ServiceCard s={service} /></Reveal>
            ))}
          </div>
          <div className="mt-8 text-center"><Btn to="/services" variant="d">Explore All Services</Btn></div>
        </div>
      </section>

      <section className="bg-white/5 py-20">
        <div className="wrap">
          <Heading eyebrow="Featured work" title="Demo Project Concepts" text="Illustrative examples of layouts and features. These are not completed client projects." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map(project => <ProjectCard key={project.slug} p={{ ...project, ...storedProjects[project.slug] }} />)}
          </div>
          <div className="mt-8 text-center"><Btn to="/projects" variant="d">View All Projects</Btn></div>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <Heading eyebrow="Why Logic Forge" title="Built Around Your Goals" text="A straightforward process focused on the needs of your business and the people who use your website." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 0.04}>
                <article className="card flex h-full gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-electric/15 text-cyan">
                    <benefit.icon size={22} aria-hidden="true" />
                  </span>
                  <div><h3 className="font-bold">{benefit.title}</h3><p className="mt-1 text-sm text-ink/70">{benefit.text}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/5 py-20">
        <div className="wrap">
          <Heading eyebrow="How it works" title="Discover. Design. Develop. Launch." />
          <Process />
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <Heading eyebrow="Starting estimates" title="Packages to Start the Conversation" text="Prices remain estimates; final scope and quote are agreed after discussing your requirements." />
          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-3">
            {pricing.map(item => <PricingCard key={item.name} t={item} />)}
          </div>
          <p className="mt-6 text-center text-sm text-ink/60">Hosting, domains, third-party services, and ongoing maintenance are not included unless agreed in writing.</p>
          <div className="mt-6 text-center"><Btn to="/pricing" variant="d">Compare Packages</Btn></div>
        </div>
      </section>

      <section className="bg-white/5 py-20">
        <div className="wrap max-w-3xl">
          <Heading eyebrow="FAQs" title="Common Questions" />
          <div className="mt-8 space-y-3">
            {faqs.slice(0, 4).map(([question, answer]) => (
              <details key={question} className="card !p-5">
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-2 text-sm text-ink/70">{answer}</p>
              </details>
            ))}
          </div>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan hover:text-white">
            Have another question? Get in touch <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <FinalCta title="Ready to plan your next website?" />
    </>
  )
}
