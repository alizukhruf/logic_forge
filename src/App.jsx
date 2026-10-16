import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Header, Footer, FX } from './components'
import { supabase } from './lib/supabase'
import { ServicesProvider } from './lib/services.jsx'
import { ShowcaseProvider } from './lib/showcase.jsx'
import { ContactInfoProvider } from './lib/contactInfo.jsx'
import * as P from './pages'

function ProtectedAdmin({ session, loading, adminLoading, isAdmin, children }) {
  if (loading || adminLoading) {
    return <div className="wrap py-20 text-center text-white/70">Checking your session…</div>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) return <Navigate to="/account" replace />

  return children
}

function ProtectedUser({ session, loading, children }) {
  if (loading) {
    return <div className="wrap py-20 text-center text-white/70">Checking your session…</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicContactPage({ session, loading, adminLoading, isAdmin }) {
  if (loading || (session && adminLoading)) {
    return <div className="wrap py-20 text-center text-white/70">Checking your access…</div>
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <P.Contact />
}

export default function Layout() {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const [adminError, setAdminError] = useState('')
  const adminRequest = useRef(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    let active = true

    const refreshAdminStatus = async currentSession => {
      const requestId = ++adminRequest.current
      if (!currentSession) {
        if (active && requestId === adminRequest.current) {
          setIsAdmin(false)
          setAdminError('')
          setAdminLoading(false)
        }
        return
      }

      if (active) setAdminLoading(true)
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .maybeSingle()

        if (active && requestId === adminRequest.current) {
          setIsAdmin(!error && data?.role === 'admin')
          setAdminError(error?.message || '')
          setAdminLoading(false)
        }
      } catch {
        if (active && requestId === adminRequest.current) {
          setIsAdmin(false)
          setAdminError('Could not verify your administrator role. Check the account setup and try again.')
          setAdminLoading(false)
        }
      }
    }

    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        if (active) {
          setLoading(false)
          setAdminLoading(false)
          setAdminError(error.message || 'Could not read the current session.')
        }
        return
      }
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
      await refreshAdminStatus(data.session)
    }

    void initializeSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setLoading(false)
      }
      setTimeout(() => {
        if (active) void refreshAdminStatus(nextSession)
      }, 0)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <ServicesProvider>
      <ShowcaseProvider>
        <ContactInfoProvider>
          <FX />
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-white focus:p-3">Skip to content</a>
          <Header session={session} isAdmin={isAdmin} />
          <motion.main id="main" key={pathname} initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
            <Routes>
              <Route path="/" element={<P.Home />} /><Route path="/about" element={<P.About />} />
              <Route path="/services" element={<P.Services />} /><Route path="/services/:slug" element={<P.ServiceDetails />} />
              <Route path="/projects" element={<P.Projects />} />
              <Route path="/projects/:slug" element={<P.ProjectDetails />} /><Route path="/pricing" element={<P.Pricing />} />
              <Route path="/contact" element={<PublicContactPage session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin} />} />
              <Route path="/login" element={<P.UserAuth session={session} loading={loading} mode="login" />} />
              <Route path="/signup" element={<P.UserAuth session={session} loading={loading} mode="signup" />} />
              <Route path="/account" element={<ProtectedUser session={session} loading={loading}><P.UserAccount session={session} /></ProtectedUser>} />
              <Route path="/admin/login" element={<P.AdminLogin session={session} loading={loading || adminLoading} isAdmin={isAdmin} adminError={adminError} />} />
              <Route path="/admin" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><P.AdminDashboard session={session} section="overview" /></ProtectedAdmin>} />
              <Route path="/admin/inquiries" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><P.AdminDashboard session={session} section="inquiries" /></ProtectedAdmin>} />
              <Route path="/admin/users" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><P.AdminDashboard session={session} section="users" /></ProtectedAdmin>} />
              <Route path="/admin/profile" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><P.AdminDashboard session={session} section="profile" /></ProtectedAdmin>} />
              <Route path="/admin/showcase" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><P.AdminDashboard session={session} section="showcase" /></ProtectedAdmin>} />
              <Route path="/admin/services" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><P.AdminDashboard session={session} section="services" /></ProtectedAdmin>} />
              <Route path="/admin/contact-info" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><P.AdminDashboard session={session} section="contact-info" /></ProtectedAdmin>} />
              <Route path="*" element={<P.NotFound />} />
            </Routes>
          </motion.main>
          {!pathname.startsWith('/admin') && !isAdmin && <Footer />}
        </ContactInfoProvider>
      </ShowcaseProvider>
    </ServicesProvider>
  )
}
