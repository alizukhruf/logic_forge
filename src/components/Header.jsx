import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo.jsx'

const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/projects', 'Projects'], ['/pricing', 'Pricing'], ['/contact', 'Contact']]

export function Header() {
  const [open, setOpen] = useState(false); const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  const cls = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? 'text-cyan' : 'text-white/80 hover:text-white'}`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/60 backdrop-blur-xl">
      <div className="wrap flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
          <Link to="/contact" className="btn btn-p ml-3 !py-2 text-sm">Let's Talk</Link></nav>
        <button className="rounded-lg p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <AnimatePresence mode="wait" initial={false}><motion.span key={open} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="block">{open ? <X /> : <Menu />}</motion.span></AnimatePresence></button>
      </div>
      <AnimatePresence>{open && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-navy lg:hidden" aria-label="Mobile">
        <div className="wrap flex flex-col gap-1 pb-5">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `rounded-xl px-4 py-3 font-semibold ${isActive ? 'bg-white/10 text-cyan' : 'text-white'}`}>{l}</NavLink>)}
          <Link to="/contact" className="btn btn-p mt-2">Let's Talk</Link></div></motion.nav>}</AnimatePresence>
    </header>
  )
}

export { links }
