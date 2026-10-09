export function Marquee({ items }) {
  return (
    <div className="overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]" aria-hidden>
      <div className="marquee flex w-max">{[...items, ...items].map((t, i) => <span key={i} className="glass mr-4 whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold">{t}</span>)}</div>
    </div>
  )
}
