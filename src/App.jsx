import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header, Footer, FX } from './components'
import * as P from './pages'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (<>
    <FX />
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-white focus:p-3">Skip to content</a>
    <Header />
    <motion.main id="main" key={pathname} initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.45 }}>
      <Routes>
        <Route path="/" element={<P.Home />} /><Route path="/about" element={<P.About />} />
        <Route path="/services" element={<P.Services />} /><Route path="/projects" element={<P.Projects />} />
        <Route path="/projects/:slug" element={<P.ProjectDetails />} /><Route path="/pricing" element={<P.Pricing />} />
        <Route path="/contact" element={<P.Contact />} /><Route path="*" element={<P.NotFound />} />
      </Routes>
    </motion.main>
    <Footer />
  </>)
}
