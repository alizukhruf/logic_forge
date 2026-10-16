import { useEffect } from 'react'

const logo = `${import.meta.env.BASE_URL}logic-forge-mark.png`
const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://logic-forge-eosin.vercel.app').replace(/\/+$/, '')

function setMeta(selector, attributes, content) {
  let meta = document.querySelector(selector)
  if (!meta) {
    meta = document.createElement('meta')
    Object.entries(attributes).forEach(([name, value]) => meta.setAttribute(name, value))
    document.head.append(meta)
  }
  meta.setAttribute('content', content)
}

export function Seo({ title, desc, noindex = false, schema }) {
  useEffect(() => {
    const pageUrl = new URL(window.location.pathname, siteUrl).href
    document.title = `${title} | Logic Forge`
    setMeta('meta[name="description"]', { name: 'description' }, desc)
    setMeta('meta[name="robots"]', { name: 'robots' }, noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:title"]', { property: 'og:title' }, `${title} | Logic Forge`)
    setMeta('meta[property="og:description"]', { property: 'og:description' }, desc)
    setMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
    setMeta('meta[property="og:image"]', { property: 'og:image' }, new URL(logo, siteUrl).href)
    setMeta('meta[property="og:url"]', { property: 'og:url' }, pageUrl)
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, `${title} | Logic Forge`)
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, desc)
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, new URL(logo, siteUrl).href)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = pageUrl

    let structuredData = document.querySelector('#logic-forge-structured-data')
    if (schema && !noindex) {
      if (!structuredData) {
        structuredData = document.createElement('script')
        structuredData.id = 'logic-forge-structured-data'
        structuredData.type = 'application/ld+json'
        document.head.append(structuredData)
      }
      structuredData.textContent = JSON.stringify(schema)
    } else {
      structuredData?.remove()
    }
  }, [title, desc, noindex, schema])

  return null
}
