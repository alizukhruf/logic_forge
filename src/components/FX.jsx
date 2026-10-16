import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

function Particles() {
  const ref = useRef()
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cv = ref.current, x = cv.getContext('2d'); let w, h, id
    const n = innerWidth < 700 ? 28 : 60
    const P = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0004, vy: (Math.random() - .5) * .0004 }))
    const rs = () => { w = cv.width = innerWidth; h = cv.height = innerHeight }; rs(); addEventListener('resize', rs)
    const f = () => {
      x.clearRect(0, 0, w, h)
      P.forEach(p => { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1 })
      P.forEach(a => {
        x.fillStyle = 'rgba(103,215,255,.65)'; x.beginPath(); x.arc(a.x * w, a.y * h, 1.5, 0, 7); x.fill()
      })
      id = requestAnimationFrame(f)
    }
    f(); return () => { cancelAnimationFrame(id); removeEventListener('resize', rs) }
  }, [])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10" aria-hidden />
}

export function FX() {
  const { scrollYProgress } = useScroll(); const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    const R = document.documentElement.style
    const mv = e => {
      R.setProperty('--gx', e.clientX + 'px'); R.setProperty('--gy', e.clientY + 'px')
      const c = e.target.closest?.('.card'); if (!c) return
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%')
      c.style.setProperty('--rx', (px - .5) * 8 + 'deg'); c.style.setProperty('--ry', (.5 - py) * 8 + 'deg')
    }
    const out = e => { const c = e.target.closest?.('.card'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg') } }
    addEventListener('mousemove', mv); addEventListener('mouseout', out)
    return () => { removeEventListener('mousemove', mv); removeEventListener('mouseout', out) }
  }, [])

  return (<>
    <motion.div style={{ scaleX: sx }} className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left bg-gradient-to-r from-electric via-cyan to-sky-100" />
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden>
      <i className="aur absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-electric/10" />
      <i className="aur absolute right-[-120px] top-1/3 h-[480px] w-[480px] rounded-full bg-cyan/10" style={{ animationDelay: '-7s' }} />
      <i className="aur absolute bottom-[-160px] left-1/3 h-[520px] w-[520px] rounded-full bg-sky-300/10" style={{ animationDelay: '-14s' }} />
    </div>
    <Particles /><div className="cursor-glow" aria-hidden />
  </>)
}
