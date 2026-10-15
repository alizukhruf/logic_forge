import { createContext, useContext, useEffect, useState } from 'react'
import { fetchShowcaseProjects } from './showcase'

const ShowcaseContext = createContext(null)

export function ShowcaseProvider({ children }) {
  const [storedProjects, setStoredProjects] = useState({})
  const [showcaseError, setShowcaseError] = useState('')

  useEffect(() => {
    let active = true

    fetchShowcaseProjects()
      .then(projects => {
        if (active) setStoredProjects(projects)
      })
      .catch(error => {
        if (active) setShowcaseError(error.message || 'Unable to load showcase images.')
      })

    return () => { active = false }
  }, [])

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
