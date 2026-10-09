import { Check } from 'lucide-react'
import { Btn } from './Btn.jsx'

export function PricingCard({ t }) {
  return (
    <div className={`relative flex flex-col rounded-3xl p-8 transition hover:-translate-y-1 ${t.featured ? 'glass glow-border shadow-2xl shadow-cyan/30 lg:scale-105' : 'glass'}`}>
      {t.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan px-4 py-1 text-xs font-bold text-ink">MOST POPULAR</span>}
      <h3 className="text-xl font-bold">{t.name}</h3>
      <p className="mt-4 text-sm opacity-70">{t.prefix || 'Estimated at'}</p><p className="text-4xl font-extrabold">{t.price}</p>
      <ul className="my-6 flex-1 space-y-3 text-sm">{t.features.map(f => <li key={f} className="flex gap-2"><Check size={18} className="shrink-0 text-cyan" />{f}</li>)}</ul>
      <Btn to="/contact" variant={t.featured ? 'p' : 'd'}>Request This Package</Btn>
    </div>
  )
}
