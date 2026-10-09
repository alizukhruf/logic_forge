import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Browser } from './Browser.jsx'

const Orbit = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 500" fill="none" aria-hidden style={{ filter: 'drop-shadow(0 0 8px #8B5CF6)' }}>
    <defs><linearGradient id="og" x1="0" x2="1"><stop stopColor="#9D6BFF" /><stop offset="1" stopColor="#4338F5" /></linearGradient></defs>
    <ellipse cx="300" cy="250" rx="290" ry="200" stroke="url(#og)" strokeWidth="2" opacity=".7" />
    <ellipse cx="300" cy="320" rx="270" ry="110" stroke="url(#og)" strokeWidth="1.5" opacity=".6" transform="rotate(-8 300 320)" />
    <circle r="5" fill="#fff"><animateMotion dur="9s" repeatCount="indefinite" path="M10,250 a290,200 0 1,0 580,0 a290,200 0 1,0 -580,0" /></circle>
    <circle r="4" fill="#9D6BFF"><animateMotion dur="6s" repeatCount="indefinite" path="M30,320 a270,110 0 1,1 540,0 a270,110 0 1,1 -540,0" /></circle>
  </svg>
)

const Phone = ({ items, title, cls, d = '0s' }) => (
  <div className={`float glass absolute w-[26%] rounded-[1.5rem] !border-2 !border-white/20 p-2 ${cls}`} style={{ animationDelay: d }} aria-hidden>
    <p className="mb-1.5 px-1 text-[9px] font-bold text-cyan">{title}</p>
    {items.map(i => <div key={i} className="mb-1 rounded-lg bg-white/10 px-2 py-1.5 text-[8px] font-semibold text-white">{i}</div>)}
  </div>
)

export function Devices({ title = 'We Build Powerful Websites' }) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-.5, .5], [10, -10]), { stiffness: 80, damping: 15 })
  const ry = useSpring(useTransform(mx, [-.5, .5], [-14, 14]), { stiffness: 80, damping: 15 })
  const mv = e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - .5); my.set((e.clientY - r.top) / r.height - .5) }

  return (
    <div onMouseMove={mv} onMouseLeave={() => { mx.set(0); my.set(0) }} style={{ perspective: 1000 }} className="relative mx-auto aspect-[6/5] w-full max-w-xl">
      <Orbit />
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="absolute inset-0">
        <div className="glass absolute right-0 top-[10%] w-[72%] rounded-2xl !border-white/25 p-1.5 shadow-[0_0_80px_rgba(124,92,255,.5)]"><Browser title={title} className="rounded-xl" /></div>
        <Phone cls="left-0 top-[26%]" title="Menu" d="1s" items={['Home', 'About Us', 'Services', 'Projects', 'Pricing', 'Contact']} />
        <Phone cls="left-[19%] top-[6%]" title="Our Services" items={['Business Websites', 'Custom Design', 'E-Commerce', 'Landing Pages', 'Maintenance']} />
      </motion.div>
    </div>
  )
}
