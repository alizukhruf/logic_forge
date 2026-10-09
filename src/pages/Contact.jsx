import { useState } from 'react'
import { MessageCircle, Mail } from 'lucide-react'
import { Seo, Btn } from '../components'
import { PageHero } from './common'
import { SITE, services } from '../data'
import { wa } from '../components'

export function Contact() {
  const empty = { name: '', email: '', phone: '', business: '', service: '', budget: '', details: '' }
  const [v, setV] = useState(empty); const [err, setErr] = useState({}); const [ok, setOk] = useState('')
  const set = k => e => setV({ ...v, [k]: e.target.value })
  const validate = () => { const e = {}
    if (v.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Please enter a valid email.'
    if (!v.service) e.service = 'Please choose a service.'
    if (v.details.trim().length < 10) e.details = 'Please add a few details (10+ characters).'
    setErr(e); return !Object.keys(e).length }
  const msg = (fallback = true) => {
    const name = v.name.trim() || 'There'
    const email = v.email.trim() || 'Not provided'
    const service = v.service || 'Website inquiry'
    const budget = v.budget || 'Not specified'
    const details = v.details.trim() || (fallback ? 'I would like to discuss a project.' : '')
    const business = v.business.trim() ? ` from ${v.business.trim()}` : ''
    const phone = v.phone.trim() ? `\nPhone: ${v.phone.trim()}` : ''
    return `Hello Logic Forge, I'm ${name}${business}.\nService: ${service}\nBudget: ${budget}\nEmail: ${email}${phone}\n\n${details}`
  }
  const send = (via, force = false) => {
    if (!force && !validate()) { setOk(''); return }
    const message = msg(true)
    const subject = 'Project Inquiry: ' + (v.service || 'Website inquiry')
    const subjectEncoded = encodeURIComponent(subject)
    const bodyEncoded = encodeURIComponent(message)

    if (via === 'wa') {
      const url = wa(message)
      const popup = window.open(url, '_blank', 'noopener,noreferrer')
      if (!popup) window.location.href = url
      setOk('WhatsApp opened with your message ready. Press send there to deliver it.')
      return
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE.email)}&su=${subjectEncoded}&body=${bodyEncoded}`
    const mailtoUrl = `mailto:${SITE.email}?subject=${subjectEncoded}&body=${bodyEncoded}`

    const popup = window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    if (!popup) {
      window.location.href = mailtoUrl
    }

    setOk('Your email app opened with your message ready. Press send there to deliver it.')
  }
  const F = ({ k, label, req, children }) => <div><label htmlFor={k} className="mb-1 block text-sm font-semibold">{label}{req ? ' *' : ' (optional)'}</label>{children}{err[k] && <p role="alert" className="mt-1 text-sm text-red-600">{err[k]}</p>}</div>

  return (<>
    <Seo title="Contact" desc="Contact Logic Forge on WhatsApp or email to discuss your website project." />
    <PageHero title={<><span>Let's Build Your <span className="grad-text">Website Together.</span></span></>} text="Have an idea for your business? Tell me what you need, and let's discuss how we can bring it online." />
    <section className="bg-white/5 py-16"><div className="wrap grid gap-8 lg:grid-cols-3">
      <form noValidate onSubmit={e => { e.preventDefault(); send('wa') }} className="card space-y-4 lg:col-span-2 !p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <F k="name" label="Name" req><input id="name" className="field" value={v.name} onChange={set('name')} autoComplete="name" /></F>
          <F k="email" label="Email" req><input id="email" type="email" className="field" value={v.email} onChange={set('email')} autoComplete="email" /></F>
          <F k="phone" label="Phone"><input id="phone" type="tel" className="field" value={v.phone} onChange={set('phone')} /></F>
          <F k="business" label="Business name"><input id="business" className="field" value={v.business} onChange={set('business')} /></F>
          <F k="service" label="Service" req><select id="service" className="field" value={v.service} onChange={set('service')}><option value="">Select a service</option>{services.map(s => <option key={s.title}>{s.title}</option>)}</select></F>
          <F k="budget" label="Budget range"><select id="budget" className="field" value={v.budget} onChange={set('budget')}><option value="">Select a range</option><option>Under PKR 25,000</option><option>PKR 25,000 – 50,000</option><option>PKR 50,000 – 80,000</option><option>PKR 80,000+</option></select></F></div>
        <F k="details" label="Project details" req><textarea id="details" rows={5} className="field" value={v.details} onChange={set('details')} /></F>
        <p className="text-xs text-ink/60">This site has no server. Sending opens WhatsApp (or your email app) with your message prefilled.</p>
        <div className="flex flex-wrap gap-3"><button type="button" onClick={() => send('wa', true)} className="btn btn-p">Send Project Inquiry</button><button type="button" onClick={() => send('mail', true)} className="btn btn-d">Send via Email Instead</button></div>
        {ok && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{ok}</p>}
        {Object.keys(err).length > 0 && !ok && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Please fix the highlighted fields.</p>}
      </form>
      <aside className="space-y-4">
        <a href={wa()} target="_blank" rel="noreferrer" className="card flex items-center gap-4"><MessageCircle className="text-cyan" /><span><b className="block">WhatsApp</b>{SITE.phoneShow}</span></a>
        <a href={`mailto:${SITE.email}`} className="card flex items-center gap-4"><Mail className="text-cyan" /><span className="break-all"><b className="block">Email</b>{SITE.email}</span></a>
        <p className="text-sm text-ink/70">Thank you for considering Logic Forge. I look forward to hearing about your project.</p></aside></div></section>
  </>)
}
