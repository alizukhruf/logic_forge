import { motion } from 'framer-motion'
import { Reveal } from './Reveal.jsx'

export function Heading({ eyebrow, title, text, dark, center = true }) {
  return (
    <Reveal className={`mb-10 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-widest text-cyan">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {text && <p className={`mt-3 ${dark ? 'text-white/70' : 'text-ink/70'}`}>{text}</p>}
    </Reveal>
  )
}
