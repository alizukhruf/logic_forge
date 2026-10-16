import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Browser } from './Browser.jsx'
import { useServices } from '../lib/services.jsx'

const OrbitGraphic = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 600 500"
    fill="none"
    aria-hidden="true"
    style={{ filter: 'drop-shadow(0 0 8px #8B5CF6)' }}
  >
    <defs>
      <linearGradient id="og" x1="0" x2="1">
        <stop stopColor="#9D6BFF" />
        <stop offset="1" stopColor="#4338F5" />
      </linearGradient>
    </defs>

    <ellipse cx="300" cy="250" rx="290" ry="200" stroke="url(#og)" strokeWidth="2" opacity=".7" />
    <ellipse
      cx="300"
      cy="320"
      rx="270"
      ry="110"
      stroke="url(#og)"
      strokeWidth="1.5"
      opacity=".6"
      transform="rotate(-8 300 320)"
    />

    <circle r="5" fill="#fff">
      <animateMotion
        dur="9s"
        repeatCount="indefinite"
        calcMode="linear"
        path="M 590 250 C 590 360.457 460.457 450 300 450 C 139.543 450 10 360.457 10 250 C 10 139.543 139.543 50 300 50 C 460.457 50 590 139.543 590 250"
      />
    </circle>

    <g transform="rotate(-8 300 320)">
      <circle r="4" fill="#9D6BFF">
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          calcMode="linear"
          path="M 570 320 C 570 380.751 449.117 430 300 430 C 150.883 430 30 380.751 30 320 C 30 259.249 150.883 210 300 210 C 449.117 210 570 259.249 570 320"
        />
      </circle>
    </g>
  </svg>
)

function FloatingPanel({ items, title, className, delay = '0s', pathname }) {
  return (
    <div
      className={`float glass absolute z-10 w-[26%] rounded-[1.5rem] !border-2 !border-white/20 p-2 ${className}`}
      style={{ animationDelay: delay }}
    >
      <p className="mb-1.5 px-1 text-[9px] font-bold text-cyan">{title}</p>
      {items.map(({ label, to }) => (
        <Link
          key={to}
          to={to}
          title={label}
          aria-current={pathname === to ? 'page' : undefined}
          className={`mb-1 block truncate rounded-lg px-2 py-1.5 text-[8px] font-semibold text-white transition-colors hover:bg-cyan/20 focus-visible:outline-cyan ${pathname === to ? 'bg-cyan/20' : 'bg-white/10'}`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}

export function Devices({ title = 'We Build Powerful Websites', image, imageAlt }) {
  const { activeServices } = useServices()
  const { pathname } = useLocation()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 80,
    damping: 15,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 80,
    damping: 15,
  })

  const handleMouseMove = event => {
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  const resetRotation = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
      style={{ perspective: 1000 }}
      className="relative mx-auto aspect-[6/5] w-full max-w-xl"
    >
      <OrbitGraphic />
      <motion.div style={{ rotateX, rotateY }} className="absolute inset-0">
        <div className="glass absolute right-0 top-[10%] w-[72%] rounded-2xl !border-white/25 p-1.5 shadow-[0_0_80px_rgba(0,0,0,.55)]">
          <Browser title={title} image={image} imageAlt={imageAlt} className="rounded-xl" />
        </div>
        <FloatingPanel
          className="left-0 top-[26%]"
          title="Menu"
          delay="1s"
          pathname={pathname}
          items={[
            { label: 'Home', to: '/' },
            { label: 'About Us', to: '/about' },
            { label: 'Services', to: '/services' },
            { label: 'Projects', to: '/projects' },
            { label: 'Pricing', to: '/pricing' },
          ]}
        />
        <FloatingPanel
          className="left-[19%] top-[6%]"
          title="Our Services"
          pathname={pathname}
          items={activeServices.map(service => ({ label: service.title, to: `/services/${service.slug}` }))}
        />
      </motion.div>
    </div>
  )
}
