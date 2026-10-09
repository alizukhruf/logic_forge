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
      P.forEach((a, i) => {
        x.fillStyle = 'rgba(157,107,255,.7)'; x.beginPath(); x.arc(a.x * w, a.y * h, 1.5, 0, 7); x.fill()
        for (let j = i + 1; j < n; j++) {
          const b = P[j], d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h)
          if (d < 130) { x.strokeStyle = `rgba(124,92,255,${.25 * (1 - d / 130)})`; x.beginPath(); x.moveTo(a.x * w, a.y * h); x.lineTo(b.x * w, b.y * h); x.stroke() }
        }
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
    <motion.div style={{ scaleX: sx }} className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left bg-gradient-to-r from-electric via-cyan to-violet-300" />
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden>
      <i className="aur absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-electric/30" />
      <i className="aur absolute right-[-120px] top-1/3 h-[480px] w-[480px] rounded-full bg-cyan/25" style={{ animationDelay: '-7s' }} />
      <i className="aur absolute bottom-[-160px] left-1/3 h-[520px] w-[520px] rounded-full bg-violet-700/25" style={{ animationDelay: '-14s' }} />
      <div className="absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(circle at 50% 30%,#000,transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%,#000,transparent 70%)' }} />
    </div>
    <Particles /><div className="cursor-glow" aria-hidden />
  </>)
}
