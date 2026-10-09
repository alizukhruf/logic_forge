import { Link } from 'react-router-dom'
import { ArrowUp, Mail, MessageCircle } from 'lucide-react'
import { Logo } from './Logo'
import { wa } from './wa'
import { SITE, services } from '../data'

const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/projects', 'Projects'], ['/pricing', 'Pricing'], ['/contact', 'Contact']]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy/70 text-white/80 backdrop-blur-xl">
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1"><Logo /><p className="mt-4 text-sm">Modern, fast, responsive websites that help businesses grow online. Your Vision, Our Code, Real Results.</p></div>
        <div><h3 className="mb-3 font-bold text-white">Navigate</h3><ul className="space-y-2 text-sm">{links.map(([to, l]) => <li key={to}><Link className="hover:text-cyan" to={to}>{l}</Link></li>)}</ul></div>
        <div><h3 className="mb-3 font-bold text-white">Services</h3><ul className="space-y-2 text-sm">{services.slice(0, 5).map(s => <li key={s.title}><Link className="hover:text-cyan" to="/services">{s.title}</Link></li>)}</ul></div>
        <div><h3 className="mb-3 font-bold text-white">Contact</h3><ul className="space-y-3 text-sm">
          <li><a className="flex items-center gap-2 hover:text-cyan" href={wa()} target="_blank" rel="noreferrer"><MessageCircle size={16} />{SITE.phoneShow}</a></li>
          <li><a className="flex items-center gap-2 break-all hover:text-cyan" href={`mailto:${SITE.email}`}><Mail size={16} />{SITE.email}</a></li></ul></div>
      </div>
      <div className="border-t border-white/10"><div className="wrap flex items-center justify-between py-5 text-sm"><p>© 2026 Logic Forge. All rights reserved.</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="grid h-10 w-10 place-items-center rounded-full bg-cyan text-ink" aria-label="Back to top"><ArrowUp size={18} /></button></div></div>
    </footer>
  )
}
