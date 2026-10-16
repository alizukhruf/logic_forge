import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const legacyRoute = window.location.hash.match(/^#(\/[^?]*)?(\?.*)?$/)
if (legacyRoute) {
  const pathname = legacyRoute[1] || '/'
  const search = legacyRoute[2] || window.location.search
  window.history.replaceState(null, '', `${pathname}${search}`)
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>
)
