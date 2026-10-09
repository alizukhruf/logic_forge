export function Browser({ title, g = 'from-dark to-electric', className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-navy shadow-2xl ring-1 ring-white/10 ${className}`} role="img" aria-label={`Website mockup of ${title} (demo concept)`}>
      <div className="flex items-center gap-1.5 bg-dark px-3 py-2"><i className="h-2 w-2 rounded-full bg-red-400" /><i className="h-2 w-2 rounded-full bg-yellow-400" /><i className="h-2 w-2 rounded-full bg-green-400" /><span className="ml-3 h-3 flex-1 rounded bg-white/10" /></div>
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${g} p-4 text-white`}>
        <div className="flex gap-2"><i className="h-2 w-10 rounded bg-white/50" /><i className="h-2 w-6 rounded bg-white/30" /><i className="h-2 w-6 rounded bg-white/30" /></div>
        <p className="mt-4 max-w-[70%] text-sm font-extrabold leading-tight sm:text-base">{title}</p>
        <i className="mt-3 block h-1.5 w-2/3 rounded bg-white/40" /><i className="mt-1.5 block h-1.5 w-1/2 rounded bg-white/30" />
        <span className="mt-4 inline-block rounded-full bg-cyan px-3 py-1 text-[10px] font-bold">Get Started</span>
        <div className="absolute bottom-3 right-3 grid grid-cols-2 gap-1.5"><i className="h-8 w-12 rounded bg-white/15" /><i className="h-8 w-12 rounded bg-white/15" /></div>
      </div>
    </div>
  )
}
