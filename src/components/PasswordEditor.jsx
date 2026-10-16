import { useState } from 'react'
import { KeyRound, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function PasswordEditor({ email }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (newPassword.length < 8) {
      setError('Your new password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('The new password and confirmation do not match.')
      return
    }

    setSaving(true)
    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })
      if (verifyError) throw new Error('The current password is incorrect.')

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setNotice('Your password was changed.')
    } catch (changeError) {
      setError(changeError.message || 'Unable to change your password.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'field'

  return (
    <section className="mt-8 border-t border-white/10 pt-6" aria-labelledby="password-heading">
      <h3 id="password-heading" className="flex items-center gap-2 text-lg font-bold text-white">
        <KeyRound size={18} className="text-cyan" aria-hidden="true" /> Change password
      </h3>
      <p className="mt-1 text-sm text-white/55">Verify your current password before setting a new one.</p>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-white/80">Current password</span>
          <input className={inputClass} type="password" value={currentPassword} onChange={event => { setCurrentPassword(event.target.value); setError(''); setNotice('') }} autoComplete="current-password" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white/80">New password</span>
          <input className={inputClass} type="password" value={newPassword} onChange={event => { setNewPassword(event.target.value); setError(''); setNotice('') }} autoComplete="new-password" minLength={8} required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white/80">Confirm new password</span>
          <input className={inputClass} type="password" value={confirmPassword} onChange={event => { setConfirmPassword(event.target.value); setError(''); setNotice('') }} autoComplete="new-password" minLength={8} required />
        </label>
        {error && <p role="alert" className="rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100 sm:col-span-2">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-cyan/30 bg-cyan/10 p-3 text-sm text-cyan-100 sm:col-span-2">{notice}</p>}
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-50">
            <Save size={17} aria-hidden="true" />
            {saving ? 'Updating password…' : 'Update password'}
          </button>
        </div>
      </form>
    </section>
  )
}
