import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageCircle, Mail } from 'lucide-react'
import { Seo, SelectField, Heading, wa, ContactOptions } from '../components'
import { supabase, supabaseReady } from '../lib/supabase'
import { PageHero } from './common'
import { faqs } from '../data'
import { useServices } from '../lib/services.jsx'
import { useContactInfo } from '../lib/contactInfo.jsx'

function ContactField({ id, label, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}{required ? ' *' : ' (optional)'}
      </label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function Contact() {
  const { activeServices } = useServices()
  const { contactInfo } = useContactInfo()
  const empty = { name: '', email: '', phone: '', business: '', service: '', budget: '', timeline: '', details: '' }
  const [searchParams] = useSearchParams()
  const requestedService = searchParams.get('service')
  const initialService = activeServices.find(service => service.title === requestedService)?.title || ''
  const [v, setV] = useState(() => ({ ...empty, service: initialService }))
  const [err, setErr] = useState({})
  const [ok, setOk] = useState(null)
  const [submissionError, setSubmissionError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitLock = useRef(false)
  const [website, setWebsite] = useState('')
  useEffect(() => {
    const service = activeServices.find(item => item.title === requestedService)
    if (service) setV(current => current.service ? current : { ...current, service: service.title })
  }, [activeServices, requestedService])

  const updateValue = (key, value) => {
    setV(current => ({ ...current, [key]: value }))
    setErr(current => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
    setOk(null)
    setSubmissionError('')
  }
  const set = key => e => updateValue(key, e.target.value)
  const validate = () => { const e = {}
    if (v.name.trim().length < 2) e.name = 'Please enter your name.'
    if (v.name.trim().length > 120) e.name = 'Your name must be 120 characters or fewer.'
    if (v.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email.'
    if (v.phone.trim()) {
      const digits = v.phone.replace(/\D/g, '')
      if (!/^\+?[\d\s().-]+$/.test(v.phone.trim()) || digits.length < 7 || digits.length > 15) {
        e.phone = 'Enter a phone number with 7 to 15 digits.'
      }
    }
    if (!v.service) e.service = 'Please choose a service.'
    if (v.details.trim().length < 10) e.details = 'Please add a few details (10+ characters).'
    if (v.details.trim().length > 5000) e.details = 'Project details must be 5,000 characters or fewer.'
    setErr(e); return !Object.keys(e).length }
  const msg = () => {
    const name = v.name.trim() || 'There'
    const email = v.email.trim() || 'Not provided'
    const service = v.service || 'Website inquiry'
    const budget = v.budget || 'Not specified'
    const timeline = v.timeline || 'Not specified'
    const details = v.details.trim()
    const business = v.business.trim() ? ` from ${v.business.trim()}` : ''
    const phone = v.phone.trim() ? `\nPhone: ${v.phone.trim()}` : ''
    return `Hello Logic Forge, I'm ${name}${business}.\nService: ${service}\nBudget: ${budget}\nPreferred launch: ${timeline}\nEmail: ${email}${phone}\n\n${details}`
  }
  const submitInquiry = async event => {
    event.preventDefault()
    if (submitLock.current) return
    setOk(null)
    setSubmissionError('')
    if (!validate()) return
    if (website.trim()) {
      setSubmissionError('Unable to submit this inquiry. Please try again.')
      return
    }
    if (!supabaseReady) {
      setSubmissionError('The contact form is not configured. Please contact us by WhatsApp or email instead.')
      return
    }

    submitLock.current = true
    setIsSubmitting(true)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      const { error } = await supabase.from('project_inquiries').insert({
        user_id: sessionData.session?.user.id || null,
        name: v.name.trim(),
        email: v.email.trim(),
        phone: v.phone.trim(),
        business_name: v.business.trim(),
        service: v.service,
        budget: v.budget,
        timeline: v.timeline,
        details: v.details.trim(),
      })

      if (error) {
        const isMissingTable = error.code === '42P01' || /does not exist|schema cache/i.test(error.message)
        const isPolicyDenied = error.code === '42501' || /row-level security|permission denied/i.test(error.message)
        setSubmissionError(isMissingTable
          ? 'The inquiry table is not set up yet. Run supabase/project_inquiries.sql in the Supabase SQL editor, then try again.'
          : isPolicyDenied
            ? 'Supabase blocked this inquiry with a row-level security policy. Run the latest supabase/project_inquiries.sql in the SQL Editor for this project, then try again.'
            : `Your inquiry could not be saved: ${error.message}`)
        return
      }

      const submitted = { message: msg(), service: v.service }
      setOk(submitted)
      setV({ ...empty })
      setErr({})
    } catch (error) {
      setSubmissionError(`Your inquiry could not be saved: ${error.message || 'Please check your connection and try again.'}`)
    } finally {
      submitLock.current = false
      setIsSubmitting(false)
    }
  }
  return (<>
    <Seo title="Contact" desc="Contact Logic Forge on WhatsApp or email to discuss your website project." />
    <PageHero title={<><span>Let's Build Your <span className="grad-text">Website Together.</span></span></>} text="Have an idea for your business? Tell me what you need, and let's discuss how we can bring it online." />
    <section className="bg-white/5 py-16"><div className="wrap grid gap-8 lg:grid-cols-3">
      <form id="project-inquiry" noValidate onSubmit={submitInquiry} className="card space-y-4 lg:col-span-2 !p-8">
        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field blank</label>
          <input id="contact-website" name="website" type="text" tabIndex="-1" autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactField id="name" label="Name" required error={err.name}><input id="name" className="field" value={v.name} onChange={set('name')} autoComplete="name" maxLength={120} required aria-invalid={Boolean(err.name)} aria-describedby={err.name ? 'name-error' : undefined} /></ContactField>
          <ContactField id="email" label="Email" required error={err.email}><input id="email" type="email" className="field" value={v.email} onChange={set('email')} autoComplete="email" maxLength={254} required aria-invalid={Boolean(err.email)} aria-describedby={err.email ? 'email-error' : undefined} /></ContactField>
          <ContactField id="phone" label="Phone" error={err.phone}><input id="phone" type="tel" inputMode="tel" className="field" value={v.phone} onChange={set('phone')} autoComplete="tel" maxLength={24} aria-invalid={Boolean(err.phone)} aria-describedby={err.phone ? 'phone-error' : undefined} /></ContactField>
          <ContactField id="business" label="Business name" error={err.business}><input id="business" className="field" value={v.business} onChange={set('business')} maxLength={160} /></ContactField>
          <ContactField id="service" label="Service" required error={err.service}><SelectField id="service" value={v.service} options={activeServices.map(s => s.title)} placeholder="Select a service" onChange={value => updateValue('service', value)} required ariaInvalid={Boolean(err.service)} ariaDescribedBy={err.service ? 'service-error' : undefined} /></ContactField>
          <ContactField id="budget" label="Budget range" error={err.budget}><SelectField id="budget" value={v.budget} options={['', 'Under PKR 25,000', 'PKR 25,000 – 50,000', 'PKR 50,000 – 80,000', 'PKR 80,000+']} placeholder="Select a range" onChange={value => updateValue('budget', value)} /></ContactField></div>
        <ContactField id="timeline" label="Preferred launch timing"><SelectField id="timeline" value={v.timeline || ''} options={['Flexible', 'Within 1 month', '1–3 months', '3+ months']} placeholder="Select a timeframe" onChange={value => updateValue('timeline', value)} /></ContactField>
        <ContactField id="details" label="Project details" required error={err.details}><textarea id="details" rows={5} maxLength={5000} className="field" value={v.details} onChange={set('details')} required aria-invalid={Boolean(err.details)} aria-describedby={err.details ? 'details-error' : undefined} /></ContactField>
        <p className="text-xs text-ink/60">Submitting saves your inquiry to the admin dashboard. You can also reach us directly using WhatsApp or email.</p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={isSubmitting} className="btn btn-p disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? 'Saving inquiry…' : 'Submit Project Inquiry'}
          </button>
        </div>
        {ok && <div role="status" className="space-y-3 rounded-xl border border-green-700/20 bg-green-50 p-4 text-sm text-green-900">
          <p>Your inquiry about {ok.service} was saved successfully. It will appear in the admin dashboard.</p>
          <div className="flex flex-wrap gap-4 font-semibold">
            <a href={wa(ok.message, contactInfo.phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Continue in WhatsApp <MessageCircle size={15} /></a>
            <a href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(`Project Inquiry: ${ok.service}`)}&body=${encodeURIComponent(ok.message)}`} className="inline-flex items-center gap-1 hover:underline">Continue by email <Mail size={15} /></a>
          </div>
        </div>}
        {submissionError && <p role="alert" className="rounded-xl border border-red-700/20 bg-red-50 p-3 text-sm text-red-800">{submissionError}</p>}
        {Object.keys(err).length > 0 && !ok && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Please fix the highlighted fields.</p>}
      </form>
      <aside className="space-y-4">
        <ContactOptions contactInfo={contactInfo} />
        <div className="card">
          <h2 className="font-bold">To help shape a useful quote</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li>What your business does and who the site is for</li>
            <li>The pages or features you have in mind</li>
            <li>Any example websites or visual references</li>
            <li>Your preferred budget range, if decided</li>
          </ul>
        </div>
      </aside></div></section>
    <section className="py-16"><div className="wrap grid gap-10 lg:grid-cols-2">
      <div>
        <Heading eyebrow="A clear process" title="What happens next?" text="Once you share your brief, we can discuss the project scope. A timeline and final quote are confirmed after reviewing your requirements." />
        <ol className="mt-6 space-y-4">
          {[
            ['01', 'Share your idea', 'Use the form, WhatsApp, or email to tell me what you are looking to build.'],
            ['02', 'Discuss the scope', 'We can clarify pages, features, references, and any questions about the project.'],
            ['03', 'Agree next steps', 'After reviewing the requirements, we can confirm a suitable approach, timeline, and quote.'],
          ].map(([number, title, text]) => (
            <li key={number} className="card flex gap-4">
              <span className="font-extrabold text-cyan">{number}</span>
              <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-ink/70">{text}</p></div>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <Heading eyebrow="Common questions" title="Before you get in touch" />
        <div className="mt-6 space-y-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="card !p-5">
              <summary className="cursor-pointer font-bold">{question}</summary>
              <p className="mt-2 text-sm text-ink/70">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div></section>
  </>)
}
