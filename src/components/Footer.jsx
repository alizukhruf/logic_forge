import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUp, Mail, MessageCircle, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { wa } from './wa'
import { useServices } from '../lib/services.jsx'
import { useContactInfo } from '../lib/contactInfo.jsx'

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/projects', 'Projects'],
  ['/pricing', 'Pricing'],
]

export function Footer() {
  const { activeServices } = useServices()
  const { contactInfo } = useContactInfo()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy/35 text-white/75 backdrop-blur-xl">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-electric/15 blur-[100px]" aria-hidden="true" />
      <div className="wrap relative z-10 pb-6 pt-12 sm:pt-16">
        <div className="mb-12 flex flex-col gap-5 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan">Have a project in mind?</p>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Let’s build something that works.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">Tell us what you’re planning and get a clear next step for your website.</p>
          </div>
          <Link to="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric to-cyan px-5 py-3 font-bold text-white shadow-lg shadow-electric/20 transition hover:-translate-y-0.5">
            Start a conversation <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.75fr_1.2fr_1fr] lg:gap-12">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              Modern, fast, responsive websites that help businesses grow online. Your vision, carefully designed and built for real results.
            </p>
            <Link to="/about" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan transition hover:text-white">
              More about Logic Forge <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white">Explore</h3>
            <ul className="space-y-3 text-sm">
              {links.map(([to, label]) => (
                <li key={to}><Link className="transition-colors hover:text-cyan" to={to}>{label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white">Services</h3>
            <ul className="space-y-3 text-sm">
              {activeServices.slice(0, 5).map(service => (
                <li key={service.slug}>
                  <Link className="transition-colors hover:text-cyan" to={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
            <Link to="/services" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan transition hover:text-white">
              View all services <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </nav>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white">Get in touch</h3>
            <p className="mb-4 text-sm leading-6 text-white/55">Have a question or ready to get started? Reach out directly.</p>
            <ul className="space-y-3">
              <li>
                <a className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm transition hover:border-cyan/40 hover:bg-white/[0.07]" href={wa('', contactInfo.phone)} target="_blank" rel="noreferrer">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300"><MessageCircle size={17} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/45">WhatsApp / Phone</span>
                    <span className="mt-0.5 block truncate font-semibold text-white/85 group-hover:text-white">{contactInfo.phoneShow}</span>
                  </span>
                </a>
              </li>
              <li>
                <a className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm transition hover:border-cyan/40 hover:bg-white/[0.07]" href={`mailto:${contactInfo.email}`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan"><Mail size={17} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/45">Email</span>
                    <span className="mt-0.5 block whitespace-nowrap text-[13px] font-semibold tracking-tight text-white/85 group-hover:text-white">{contactInfo.email}</span>
                  </span>
                </a>
              </li>
            </ul>
            <a href={`tel:+${contactInfo.phone}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-cyan">
              <Phone size={15} aria-hidden="true" /> Call us directly
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Logic Forge. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/contact" className="transition-colors hover:text-white/80">Contact</Link>
            <Link to="/privacy" className="transition-colors hover:text-white/80">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-white/80">Terms</Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-semibold text-white/70 transition hover:border-cyan/40 hover:text-white"
              aria-label="Back to top"
            >
              Back to top <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
