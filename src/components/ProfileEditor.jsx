import { useEffect, useState } from 'react'
import { Mail, Phone, Save, UserRound } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { normalizePhoneNumber } from '../lib/profile'

export function ProfileEditor({ profile, onSaved, buttonLabel = 'Save profile' }) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFullName(profile?.full_name || '')
    setPhone(profile?.phone || '')
    setError('')
    setNotice('')
  }, [profile?.id])

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setNotice('')

    const name = fullName.trim()
    if (name.length < 2 || name.length > 120) {
      setError('Enter a name between 2 and 120 characters.')
      return
    }

    let normalizedPhone
    try {
      normalizedPhone = normalizePhoneNumber(phone)
    } catch (validationError) {
      setError(validationError.message)
      return
    }

    setSaving(true)
    try {
      const { data, error: saveError } = await supabase
        .from('user_profiles')
        .update({ full_name: name, phone: normalizedPhone })
        .eq('id', profile.id)
        .select('id, email, full_name, phone, role, created_at')
        .single()

      if (saveError) throw saveError
      onSaved?.(data)
      setNotice('Your profile was updated.')
    } catch (saveError) {
      setError(saveError.message || 'Unable to save your profile.')
    } finally {
      setSaving(false)
    }
  }

  const cardClass = 'surface-card flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm focus-within:border-cyan/50'
  const iconClass = 'shrink-0 text-cyan'
  const valueClass = 'mt-1 block w-full min-w-0 bg-transparent font-semibold text-white outline-none placeholder:text-white/40 focus:ring-0'

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={cardClass}>
          <UserRound size={17} className={iconClass} aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs uppercase tracking-wider text-white/45">Full name</span>
            <input
              className={valueClass}
              value={fullName}
              onChange={event => { setFullName(event.target.value); setError(''); setNotice('') }}
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              aria-label="Full name"
            />
          </span>
        </label>
        <div className={cardClass}>
          <Mail size={17} className={iconClass} aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-wider text-white/45">Email</span>
            <span className="mt-1 block break-all font-semibold">{profile.email}</span>
          </span>
        </div>
        <label className={cardClass}>
          <Phone size={17} className={iconClass} aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs uppercase tracking-wider text-white/45">Phone</span>
            <input
              className={valueClass}
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={event => { setPhone(event.target.value); setError(''); setNotice('') }}
              autoComplete="tel"
              maxLength={24}
              placeholder="Not provided"
              aria-label="Phone number"
              aria-describedby={`phone-help-${profile.id}`}
            />
          </span>
        </label>
        <span id={`phone-help-${profile.id}`} className="text-xs text-white/50 sm:col-span-2">
          Phone is optional. Use 7–15 digits; a country code is recommended.
        </span>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
      {notice && <p role="status" className="mt-4 rounded-xl border border-cyan/30 bg-cyan/10 p-3 text-sm text-cyan-100">{notice}</p>}
      <div className="mt-4">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric to-cyan px-5 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-50">
          <Save size={17} aria-hidden="true" />
          {saving ? 'Saving…' : buttonLabel}
        </button>
      </div>
    </form>
  )
}
