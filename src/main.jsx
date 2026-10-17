import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const isDesktopBuild = import.meta.env.MODE === 'desktop'
const Router = isDesktopBuild ? HashRouter : BrowserRouter

if (!isDesktopBuild) {
  const legacyRoute = window.location.hash.match(/^#(\/[^?]*)?(\?.*)?$/)
  if (legacyRoute) {
    const pathname = legacyRoute[1] || '/'
    const search = legacyRoute[2] || window.location.search
    window.history.replaceState(null, '', `${pathname}${search}`)
  }
}

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
)
