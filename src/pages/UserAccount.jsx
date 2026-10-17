import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, MessageCircle, RefreshCw, Send, UserRound } from 'lucide-react'
import { PasswordEditor, ProfileEditor, Seo } from '../components'
import { supabase } from '../lib/supabase'

const statuses = {
  new: 'New',
  processing: 'Processing',
  completed: 'Completed',
  rejected: 'Rejected',
  closed: 'Closed',
}

function formatDate(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

export function UserAccount({ session }) {
  const navigate = useNavigate()
  const userId = session.user.id
  const [profile, setProfile] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [messagesByInquiry, setMessagesByInquiry] = useState({})
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [sendingInquiryId, setSendingInquiryId] = useState('')

  const loadAccount = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)
    else setRefreshing(true)
    setError('')

    try {
      const [{ data: profileData, error: profileError }, { data: inquiryData, error: inquiryError }] = await Promise.all([
        supabase.from('user_profiles').select('id, email, full_name, phone, role, created_at').eq('id', userId).maybeSingle(),
        supabase.from('project_inquiries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ])

      if (profileError) throw profileError
      if (inquiryError) throw inquiryError

      const currentInquiries = inquiryData || []
      setProfile(profileData)
      setInquiries(currentInquiries)

      if (!currentInquiries.length) {
        setMessagesByInquiry({})
        return
      }

      const { data: messageData, error: messagesError } = await supabase
        .from('inquiry_messages')
        .select('id, inquiry_id, sender_id, sender_role, body, created_at')
        .in('inquiry_id', currentInquiries.map(inquiry => inquiry.id))
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      const grouped = (messageData || []).reduce((result, message) => {
        result[message.inquiry_id] ||= []
        result[message.inquiry_id].push(message)
        return result
      }, {})
      setMessagesByInquiry(grouped)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load your account details.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [userId])

  useEffect(() => {
    void loadAccount(true)

    const channel = supabase
      .channel(`user-account-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles', filter: `id=eq.${userId}` }, () => void loadAccount())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_inquiries', filter: `user_id=eq.${userId}` }, () => void loadAccount())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiry_messages' }, () => void loadAccount())
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError('Live updates are unavailable. Use Refresh to load the latest account information.')
        }
      })

    return () => { void supabase.removeChannel(channel) }
  }, [loadAccount])

  const sendMessage = async (event, inquiry) => {
    event.preventDefault()
    const body = (drafts[inquiry.id] || '').trim()
    if (!body || sendingInquiryId) return

    setSendingInquiryId(inquiry.id)
    setError('')
    try {
      const { data, error: sendError } = await supabase
        .from('inquiry_messages')
        .insert({
          inquiry_id: inquiry.id,
          sender_id: userId,
          sender_role: 'user',
          body,
        })
        .select('id, inquiry_id, sender_id, sender_role, body, created_at')
        .single()

      if (sendError) throw sendError
      setMessagesByInquiry(current => ({ ...current, [inquiry.id]: [...(current[inquiry.id] || []), data] }))
      setDrafts(current => ({ ...current, [inquiry.id]: '' }))
    } catch (sendError) {
      setError(sendError.message || 'Unable to send your message.')
    } finally {
      setSendingInquiryId('')
    }
  }

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError.message || 'Unable to sign out.')
      return
    }
    navigate('/', { replace: true })
  }

  const statusStyle = status => ({
    new: 'border-cyan/30 bg-cyan/10 text-cyan-100',
    processing: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
    completed: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
    rejected: 'border-red-300/30 bg-red-300/10 text-red-100',
    closed: 'border-white/15 bg-white/5 text-white/60',
  }[status] || 'border-white/15 bg-white/5 text-white/70')

  return (
    <>
      <Seo title="My Account" desc="View your Logic Forge profile, project inquiries, and messages." noindex />
      <section className="min-h-[70vh] py-12 text-white sm:py-16">
        <div className="wrap">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan">Your workspace</p>
              <h1 className="mt-2 text-4xl font-black sm:text-5xl">My account</h1>
              <p className="mt-2 text-white/60">Your details, project updates, and conversations in one place.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => void loadAccount()} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-60">
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
              </button>
              <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>

          {error && <p role="alert" className="mb-6 rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</p>}

          {loading ? (
            <div className="glass surface-card rounded-3xl p-8 text-center text-white/70">Loading your account…</div>
          ) : (
            <>
              <section className="glass surface-card mb-8 rounded-3xl p-6 sm:p-8" aria-labelledby="profile-heading">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan/10 text-cyan"><UserRound size={27} /></span>
                  <div>
                    <h2 id="profile-heading" className="text-2xl font-bold">Your profile</h2>
                    <p className="text-sm text-white/55">Member since {profile?.created_at ? formatDate(profile.created_at) : '—'}</p>
                  </div>
                </div>
                {profile && <ProfileEditor profile={profile} onSaved={setProfile} />}
                {profile && <PasswordEditor email={profile.email || session.user.email} />}
              </section>

              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan">Project conversations</p>
                  <h2 className="mt-1 text-2xl font-extrabold">Your inquiries</h2>
                </div>
                <Link to="/contact" className="text-sm font-bold text-cyan hover:text-white">Start a new inquiry</Link>
              </div>

              {!inquiries.length ? (
                <div className="glass surface-card rounded-3xl p-8 text-center">
                  <MessageCircle className="mx-auto mb-3 text-cyan" size={30} />
                  <p className="font-semibold">You have not submitted any inquiries yet.</p>
                  <Link to="/contact" className="btn btn-p mt-5">Contact us</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {inquiries.map(inquiry => {
                    const inquiryMessages = messagesByInquiry[inquiry.id] || []
                    const status = statuses[inquiry.status] ? inquiry.status : 'new'
                    return (
                      <article key={inquiry.id} className="glass surface-card overflow-hidden rounded-3xl">
                        <div className="border-b border-white/10 p-5 sm:p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-white/50">Submitted {formatDate(inquiry.created_at)}</p>
                              <h3 className="mt-1 text-xl font-bold">{inquiry.service}</h3>
                            </div>
                            <span className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${statusStyle(status)}`}>{statuses[status]}</span>
                          </div>
                          <div className="mt-4 grid gap-2 text-sm text-white/65 sm:grid-cols-2">
                            <p>Business: {inquiry.business_name || 'Not provided'}</p>
                            <p>Budget: {inquiry.budget || 'Not specified'} · Timeline: {inquiry.timeline || 'Not specified'}</p>
                          </div>
                          <p className="mt-4 whitespace-pre-wrap rounded-xl bg-white/[0.04] p-4 text-sm leading-relaxed text-white/80">{inquiry.details}</p>
                        </div>

                        <div className="p-5 sm:p-6">
                          <div className="mb-4 flex items-center gap-2 font-bold"><MessageCircle size={18} className="text-cyan" /> Conversation <span className="text-xs font-normal text-white/45">({inquiryMessages.length} messages)</span></div>
                          <div className="max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/10 p-4" aria-live="polite">
                            {inquiryMessages.length ? inquiryMessages.map(message => (
                              <div key={message.id} className={`flex ${message.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[80%] ${message.sender_role === 'user' ? 'bg-electric/30 text-white' : 'border border-cyan/20 bg-cyan/10 text-white'}`}>
                                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/55">{message.sender_role === 'admin' ? 'Logic Forge team' : 'You'}</p>
                                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.body}</p>
                                  <p className="mt-2 text-right text-[10px] text-white/45">{formatDate(message.created_at)}</p>
                                </div>
                              </div>
                            )) : <p className="py-5 text-center text-sm text-white/50">No messages yet. The team will reply here.</p>}
                          </div>
                          <form onSubmit={event => void sendMessage(event, inquiry)} className="mt-3 flex flex-col gap-2 sm:flex-row">
                            <textarea
                              value={drafts[inquiry.id] || ''}
                              onChange={event => setDrafts(current => ({ ...current, [inquiry.id]: event.target.value }))}
                              placeholder="Write a message…"
                              maxLength={5000}
                              rows={2}
                              className="field min-h-12 flex-1 resize-y"
                              aria-label={`Message for inquiry: ${inquiry.service}`}
                            />
                            <button type="submit" disabled={sendingInquiryId === inquiry.id || !(drafts[inquiry.id] || '').trim()} className="btn btn-p self-end disabled:cursor-not-allowed disabled:opacity-50 sm:self-stretch">
                              <Send size={16} /> {sendingInquiryId === inquiry.id ? 'Sending…' : 'Send'}
                            </button>
                          </form>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
