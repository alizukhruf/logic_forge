import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchShowcaseProjects } from './showcase'
import { supabase } from './supabase'

const ShowcaseContext = createContext(null)

export function ShowcaseProvider({ children }) {
  const [storedProjects, setStoredProjects] = useState({})
  const [showcaseError, setShowcaseError] = useState('')

  const refreshShowcase = useCallback(async () => {
    try {
      setStoredProjects(await fetchShowcaseProjects())
      setShowcaseError('')
    } catch (error) {
      setShowcaseError(error.message || 'Unable to load showcase images.')
    }
  }, [])

  useEffect(() => {
    void refreshShowcase()
    const channel = supabase
      .channel('public-site-showcase')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_showcase_projects' }, () => void refreshShowcase())
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setShowcaseError('Live showcase updates are unavailable. Reload the page to see recent changes.')
        }
      })

    return () => { void supabase.removeChannel(channel) }
  }, [refreshShowcase])

  return (
    <ShowcaseContext.Provider value={{ storedProjects, showcaseError }}>
      {children}
    </ShowcaseContext.Provider>
  )
}

export function useShowcaseProjects() {
  const context = useContext(ShowcaseContext)
  if (!context) throw new Error('useShowcaseProjects must be used within ShowcaseProvider.')
  return context
}
