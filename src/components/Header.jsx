import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CircleUserRound, Menu, X } from 'lucide-react'
import { Logo } from './Logo.jsx'

const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/projects', 'Projects'], ['/pricing', 'Pricing']]

export function Header({ session, isAdmin }) {
  const [open, setOpen] = useState(false); const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  useEffect(() => setOpen(false), [pathname])
  const cls = ({ isActive }) => `rounded-full border border-white/25 px-3 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-cyan/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.16)] focus-visible:border-cyan/70 ${isActive ? 'bg-white/[0.06] text-cyan' : 'text-white/80'}`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/60 backdrop-blur-xl">
      <div className="wrap flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
          {isAdmin ? (
            <Link to="/admin" className="rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-cyan/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.16)]">Admin dashboard</Link>
          ) : session ? (
            <Link to="/account" aria-label="My account" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-cyan/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.16)]">
              <CircleUserRound size={18} className="text-cyan" aria-hidden="true" /> Account
            </Link>
          ) : (
            <Link to="/login" className="rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-cyan/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.16)]">Log in / Sign up</Link>
          )}
          {!isAdmin && <Link to="/contact" className="btn btn-p ml-3 !py-2 text-sm">Let's Talk</Link>}</nav>
        <button className="rounded-lg p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <AnimatePresence mode="wait" initial={false}><motion.span key={open} initial={reduceMotion ? false : { rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: reduceMotion ? 0 : 90, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="block">{open ? <X /> : <Menu />}</motion.span></AnimatePresence></button>
      </div>
      <AnimatePresence>{open && <motion.nav initial={reduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="overflow-hidden bg-navy lg:hidden" aria-label="Mobile">
        <div className="wrap flex flex-col gap-2 pb-5">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `rounded-xl border border-white/25 px-4 py-3 font-semibold transition duration-300 hover:border-cyan/70 hover:bg-white/10 hover:text-cyan focus-visible:border-cyan/70 ${isActive ? 'bg-white/10 text-cyan' : 'text-white'}`}>{l}</NavLink>)}
          {isAdmin ? (
            <Link to="/admin" className="rounded-xl border border-white/25 px-4 py-3 font-semibold text-white transition hover:border-cyan/70 hover:bg-white/10 hover:text-cyan">Admin dashboard</Link>
          ) : session ? (
            <Link to="/account" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-3 font-semibold text-white transition hover:border-cyan/70 hover:bg-white/10 hover:text-cyan"><CircleUserRound size={18} aria-hidden="true" /> My account</Link>
          ) : (
            <Link to="/login" className="rounded-xl border border-white/25 px-4 py-3 font-semibold text-white transition hover:border-cyan/70 hover:bg-white/10 hover:text-cyan">Log in / Sign up</Link>
          )}
          {!isAdmin && <Link to="/contact" className="btn btn-p mt-2">Let's Talk</Link>}</div></motion.nav>}</AnimatePresence>
    </header>
  )
}
