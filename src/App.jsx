import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Header, Footer, FX, LoadingScreen } from './components'
import { supabase } from './lib/supabase'
import { ServicesProvider } from './lib/services.jsx'
import { ShowcaseProvider } from './lib/showcase.jsx'
import { ContactInfoProvider } from './lib/contactInfo.jsx'

const Home = lazy(() => import('./pages/Home.jsx').then(module => ({ default: module.Home })))
const About = lazy(() => import('./pages/About.jsx').then(module => ({ default: module.About })))
const Services = lazy(() => import('./pages/Services.jsx').then(module => ({ default: module.Services })))
const ServiceDetails = lazy(() => import('./pages/ServiceDetails.jsx').then(module => ({ default: module.ServiceDetails })))
const Projects = lazy(() => import('./pages/Projects.jsx').then(module => ({ default: module.Projects })))
const ProjectDetails = lazy(() => import('./pages/ProjectDetails.jsx').then(module => ({ default: module.ProjectDetails })))
const Pricing = lazy(() => import('./pages/Pricing.jsx').then(module => ({ default: module.Pricing })))
const Contact = lazy(() => import('./pages/Contact.jsx').then(module => ({ default: module.Contact })))
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx').then(module => ({ default: module.AdminLogin })))
const UserAuth = lazy(() => import('./pages/UserAuth.jsx').then(module => ({ default: module.UserAuth })))
const UserAccount = lazy(() => import('./pages/UserAccount.jsx').then(module => ({ default: module.UserAccount })))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx').then(module => ({ default: module.AdminDashboard })))
const NotFound = lazy(() => import('./pages/NotFound.jsx').then(module => ({ default: module.NotFound })))
const PrivacyPolicy = lazy(() => import('./pages/Legal.jsx').then(module => ({ default: module.PrivacyPolicy })))
const TermsOfService = lazy(() => import('./pages/Legal.jsx').then(module => ({ default: module.TermsOfService })))

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

  return <Contact />
}

export default function Layout() {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const [adminError, setAdminError] = useState('')
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem('logic-forge-theme')
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
    } catch (error) {
      console.warn('Unable to read the saved theme preference.', error)
      return 'dark'
    }
  })
  const adminRequest = useRef(0)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (showLoadingScreen) document.body.style.overflow = 'hidden'
    const duration = reduceMotion ? 650 : 2900
    const timeout = showLoadingScreen
      ? window.setTimeout(() => setShowLoadingScreen(false), duration)
      : undefined
    return () => {
      if (timeout) window.clearTimeout(timeout)
      document.body.style.overflow = previousOverflow
    }
  }, [reduceMotion, showLoadingScreen])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem('logic-forge-theme', theme)
    } catch (error) {
      console.warn('Unable to save the theme preference.', error)
    }
  }, [theme])

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
          <Header session={session} isAdmin={isAdmin} theme={theme} onThemeChange={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} />
          <motion.main id="main" key={pathname} initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
            <Suspense fallback={<div className="wrap py-20 text-center text-white/70" role="status">Loading page…</div>}>
            <Routes>
              <Route path="/" element={<Home />} /><Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} /><Route path="/services/:slug" element={<ServiceDetails />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} /><Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<PublicContactPage session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin} />} />
              <Route path="/login" element={<UserAuth session={session} loading={loading} mode="login" />} />
              <Route path="/signup" element={<UserAuth session={session} loading={loading} mode="signup" />} />
              <Route path="/account" element={<ProtectedUser session={session} loading={loading}><UserAccount session={session} /></ProtectedUser>} />
              <Route path="/admin/login" element={<AdminLogin session={session} loading={loading || adminLoading} isAdmin={isAdmin} adminError={adminError} />} />
              <Route path="/admin" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><AdminDashboard session={session} section="overview" /></ProtectedAdmin>} />
              <Route path="/admin/inquiries" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><AdminDashboard session={session} section="inquiries" /></ProtectedAdmin>} />
              <Route path="/admin/users" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><AdminDashboard session={session} section="users" /></ProtectedAdmin>} />
              <Route path="/admin/profile" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><AdminDashboard session={session} section="profile" /></ProtectedAdmin>} />
              <Route path="/admin/showcase" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><AdminDashboard session={session} section="showcase" /></ProtectedAdmin>} />
              <Route path="/admin/services" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><AdminDashboard session={session} section="services" /></ProtectedAdmin>} />
              <Route path="/admin/contact-info" element={<ProtectedAdmin session={session} loading={loading} adminLoading={adminLoading} isAdmin={isAdmin}><AdminDashboard session={session} section="contact-info" /></ProtectedAdmin>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </motion.main>
          {!pathname.startsWith('/admin') && !isAdmin && <Footer />}
          <AnimatePresence>
            {showLoadingScreen && <LoadingScreen reducedMotion={Boolean(reduceMotion)} />}
          </AnimatePresence>
        </ContactInfoProvider>
      </ShowcaseProvider>
    </ServicesProvider>
  )
}
