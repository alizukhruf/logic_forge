import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Seo } from '../components'

export function AdminLogin({ session, loading, isAdmin, adminError }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && session) {
      navigate(isAdmin ? '/admin' : '/account', { replace: true })
    }
  }, [isAdmin, loading, navigate, session])

  const handleChange = (field) => (event) => {
    setForm(current => ({ ...current, [field]: event.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      })

      if (signInError) {
        setError(signInError.message || 'Unable to sign in. Please check your credentials.')
        return
      }

      navigate('/admin', { replace: true })
    } catch (signInError) {
      setError(signInError.message || 'Something went wrong while signing in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24">
        <div className="wrap flex justify-center">
          <div className="card max-w-md w-full text-center text-white/70">Checking your admin session…</div>
        </div>
      </section>
    )
  }

  if (session) {
    return <Navigate to={isAdmin ? '/admin' : '/account'} replace />
  }

  return (
    <>
      <Seo title="Admin Login" desc="Sign in to access the Logic Forge admin panel." />
      <section className="py-24">
        <div className="wrap">
          <div className="mx-auto max-w-md">
            <div className="card overflow-hidden !p-0 text-white">
              <div className="bg-gradient-to-r from-electric to-cyan px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70">Logic Forge</p>
                    <h1 className="text-xl font-extrabold">Admin portal</h1>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">Sign in</p>
                  <h2 className="mt-2 text-3xl font-extrabold">Welcome back</h2>
                </div>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
                    <Mail className="h-4 w-4 text-cyan" /> Email
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="admin@yourdomain.com"
                    className="field"
                    required
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
                    <LockKeyhole className="h-4 w-4 text-cyan" /> Password
                  </span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    placeholder="Enter your password"
                    className="field"
                    required
                    autoComplete="current-password"
                  />
                </label>

                {error && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                    {error}
                  </div>
                )}
                {adminError && (
                  <div role="alert" className="rounded-xl border border-amber-300/30 bg-amber-200/10 p-3 text-sm text-amber-100">
                    Could not verify the administrator role: {adminError}
                  </div>
                )}
                <button type="submit" className="btn btn-p w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in…' : 'Sign in to dashboard'}
                </button>

                <p className="text-center text-xs text-white/55">
                  Only accounts assigned the admin role can access the dashboard.
                </p>
                <p className="text-center text-sm text-white/60">
                  Looking for user sign in? <Link className="font-bold text-cyan hover:text-white" to="/login">User login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
