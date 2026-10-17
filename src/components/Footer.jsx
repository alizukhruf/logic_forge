import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUp, Mail, MessageCircle, MoveUpRight, Phone } from 'lucide-react'
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
        <div className="footer-cta-card relative mb-10 flex flex-col gap-6 overflow-hidden rounded-[2rem] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan">Have a project in mind?</p>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Let’s build something that works.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">Tell us what you’re planning and get a clear next step for your website.</p>
          </div>
          <Link to="/contact" className="btn btn-p relative z-10 shrink-0 !rounded-xl !px-5 !py-3">
            Start a conversation <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 border-b border-white/10 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          <section className="footer-panel">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-white/60">
              Modern, fast, responsive websites that help businesses grow online. Your vision, carefully designed and built for real results.
            </p>
            <Link to="/about" className="footer-panel-link mt-5">
              About Logic Forge <MoveUpRight size={15} aria-hidden="true" />
            </Link>
          </section>

          <nav className="footer-panel" aria-label="Footer navigation">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan">Explore</h3>
            <ul className="space-y-1.5">
              {links.map(([to, label]) => (
                <li key={to}><Link className="footer-nav-link" to={to}>{label}<MoveUpRight size={13} aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </nav>

          <nav className="footer-panel" aria-label="Footer services">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan">Services</h3>
            <ul className="space-y-1.5">
              {activeServices.slice(0, 5).map(service => (
                <li key={service.slug}>
                  <Link className="footer-nav-link" to={`/services/${service.slug}`}>{service.title}<MoveUpRight size={13} aria-hidden="true" /></Link>
                </li>
              ))}
            </ul>
            <Link to="/services" className="footer-panel-link mt-4">
              View all services <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </nav>

          <section className="footer-panel">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan">Get in touch</h3>
            <p className="mb-4 mt-2 text-sm leading-6 text-white/55">Have a question? Reach out directly.</p>
            <ul className="space-y-2">
              <li>
                <a className="footer-contact-link group" href={wa('', contactInfo.phone)} target="_blank" rel="noreferrer">
                  <span className="footer-contact-icon bg-emerald-400/10 text-emerald-300"><MessageCircle size={17} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/45">WhatsApp</span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-white/85 group-hover:text-white">{contactInfo.phoneShow}</span>
                  </span>
                </a>
              </li>
              <li>
                <a className="footer-contact-link group" href={`mailto:${contactInfo.email}`}>
                  <span className="footer-contact-icon bg-cyan/10 text-cyan"><Mail size={17} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/45">Email</span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-white/85 group-hover:text-white">{contactInfo.email}</span>
                  </span>
                </a>
              </li>
            </ul>
            <a href={`tel:+${contactInfo.phone}`} className="footer-panel-link mt-4">
              <Phone size={15} aria-hidden="true" /> Call us
            </a>
          </section>
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
              className="footer-top-link"
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
