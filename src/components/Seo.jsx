import { useEffect } from 'react'

export function Seo({ title, desc }) {
  useEffect(() => {
    document.title = `${title} | Logic Forge`
    let m = document.querySelector('meta[name=description]'); if (m) m.content = desc
    const og = document.querySelector('meta[property="og:title"]'); if (og) og.content = `${title} | Logic Forge`
  }, [title, desc]);

  return null
}
