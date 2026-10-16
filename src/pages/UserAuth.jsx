import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Seo } from '../components'
import { supabase } from '../lib/supabase'
import { normalizePhoneNumber } from '../lib/profile'

export function UserAuth({ session, loading, mode }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <section className="py-24"><div className="wrap"><div className="card mx-auto max-w-md text-center text-white/70">Checking your session…</div></div></section>
  }

  const setField = field => event => {
    setForm(current => ({ ...current, [field]: event.target.value }))
    setError('')
    setNotice('')
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    try {
      if (isSignup) {
        let phone
        try {
          phone = normalizePhoneNumber(form.phone)
        } catch (validationError) {
          setError(validationError.message)
          return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            data: {
              full_name: form.fullName.trim(),
              phone,
            },
          },
        })

        if (signUpError) {
          setError(signUpError.message || 'Unable to create your account.')
          return
        }

        if (data.session) {
          navigate('/account', { replace: true })
        } else {
          setNotice('Your account was created. Check your email to confirm your address, then sign in.')
        }
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      })

      if (signInError) {
        setError(signInError.message || 'Unable to sign in. Check your email and password.')
        return
      }

      navigate('/account', { replace: true })
    } catch (authError) {
      setError(authError.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title={isSignup ? 'Create an Account' : 'User Sign In'} desc={isSignup ? 'Create a Logic Forge account to manage your project inquiries.' : 'Sign in to your Logic Forge account.'} />
      <section className="py-20 sm:py-24">
        <div className="wrap">
          <div className="card mx-auto max-w-lg overflow-hidden !p-0 text-white">
            <div className="bg-gradient-to-r from-electric to-cyan px-6 py-6 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/75">Logic Forge account</p>
              <h1 className="mt-2 text-3xl font-extrabold">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
              <p className="mt-2 text-sm text-white/80">{isSignup ? 'Keep your project conversations connected in one place.' : 'Sign in to continue.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
              {session && (
                <p role="status" className="rounded-xl border border-cyan/30 bg-cyan/10 p-3 text-sm text-cyan-100">
                  You’re signed in as {session.user.email}. You can still use this page to switch accounts or create another account.
                </p>
              )}
              {isSignup && (
                <>
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80"><UserRound className="h-4 w-4 text-cyan" /> Full name</span>
                    <input className="field" value={form.fullName} onChange={setField('fullName')} autoComplete="name" required minLength={2} maxLength={120} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white/80">Phone <span className="font-normal text-white/45">optional</span></span>
                    <input className="field" type="tel" inputMode="tel" value={form.phone} onChange={setField('phone')} autoComplete="tel" maxLength={24} aria-describedby="signup-phone-help" />
                    <span id="signup-phone-help" className="mt-1 block text-xs text-white/50">Optional. Use 7–15 digits; a country code is recommended.</span>
                  </label>
                </>
              )}

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80"><Mail className="h-4 w-4 text-cyan" /> Email</span>
                <input className="field" type="email" value={form.email} onChange={setField('email')} autoComplete="email" required maxLength={254} />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80"><LockKeyhole className="h-4 w-4 text-cyan" /> Password</span>
                <input className="field" type="password" value={form.password} onChange={setField('password')} autoComplete={isSignup ? 'new-password' : 'current-password'} required minLength={isSignup ? 8 : 1} />
                {isSignup && <span className="mt-1 block text-xs text-white/50">Use at least 8 characters.</span>}
              </label>

              {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
              {notice && <p role="status" className="rounded-xl border border-cyan/30 bg-cyan/10 p-3 text-sm text-cyan-100">{notice}</p>}

              <button type="submit" disabled={submitting} className="btn btn-p w-full disabled:cursor-wait disabled:opacity-60">
                {submitting ? (isSignup ? 'Creating account…' : 'Signing in…') : (isSignup ? 'Create account' : 'Sign in')}
              </button>

              <p className="text-center text-sm text-white/60">
                {isSignup ? 'Already have an account?' : 'New to Logic Forge?'}{' '}
                <Link className="font-bold text-cyan hover:text-white" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link>
              </p>
              <Link to="/admin/login" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan/35 bg-cyan/10 px-4 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan/20">
                <ShieldCheck size={17} aria-hidden="true" /> Admin login
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
