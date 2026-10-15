import { useEffect } from 'react'

const logo = `${import.meta.env.BASE_URL}logic-forge-mark.png`

function setMeta(selector, attributes, content) {
  let meta = document.querySelector(selector)
  if (!meta) {
    meta = document.createElement('meta')
    Object.entries(attributes).forEach(([name, value]) => meta.setAttribute(name, value))
    document.head.append(meta)
  }
  meta.setAttribute('content', content)
}

export function Seo({ title, desc }) {
  useEffect(() => {
    document.title = `${title} | Logic Forge`
    setMeta('meta[name="description"]', { name: 'description' }, desc)
    setMeta('meta[property="og:title"]', { property: 'og:title' }, `${title} | Logic Forge`)
    setMeta('meta[property="og:description"]', { property: 'og:description' }, desc)
    setMeta('meta[property="og:image"]', { property: 'og:image' }, new URL(logo, window.location.origin).href)
    setMeta('meta[property="og:url"]', { property: 'og:url' }, window.location.href)
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, `${title} | Logic Forge`)
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, desc)
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, new URL(logo, window.location.origin).href)
  }, [title, desc])

  return null
}
