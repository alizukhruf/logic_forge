import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Briefcase, LifeBuoy, Palette, RefreshCw, Rocket, Search, ShoppingCart, Smartphone } from 'lucide-react'
import { services as bundledServices } from '../data'
import { supabase } from './supabase'

const icons = { Briefcase, LifeBuoy, Palette, RefreshCw, Rocket, Search, ShoppingCart, Smartphone }
const ServicesContext = createContext(null)

export function toServiceRecord(service) {
  return {
    slug: service.slug,
    title: service.title.trim(),
    summary: service.text.trim(),
    details: service.details.trim(),
    icon: service.iconName,
    features: service.features,
    display_order: Number(service.displayOrder),
    is_active: Boolean(service.isActive),
  }
}

function fromServiceRecord(record) {
  const iconName = icons[record.icon] ? record.icon : 'Briefcase'
  return {
    slug: record.slug,
    title: record.title,
    text: record.summary,
    details: record.details,
    iconName,
    icon: icons[iconName],
    features: Array.isArray(record.features) ? record.features : [],
    displayOrder: record.display_order,
    isActive: record.is_active,
  }
}

export async function fetchServices() {
  const { data, error } = await supabase
    .from('site_services')
    .select('slug,title,summary,details,icon,features,display_order,is_active')
    .order('display_order', { ascending: true })
    .order('title', { ascending: true })

  if (error) throw error
  return (data || []).map(fromServiceRecord)
}

export function ServicesProvider({ children }) {
  const [services, setServices] = useState(bundledServices)
  const [servicesError, setServicesError] = useState('')
  const [loadingServices, setLoadingServices] = useState(true)

  const refreshServices = useCallback(async () => {
    setServicesError('')
    try {
      setServices(await fetchServices())
    } catch (error) {
      setServicesError(error.message || 'Unable to load services from the database.')
      setServices(bundledServices)
    } finally {
      setLoadingServices(false)
    }
  }, [])

  useEffect(() => {
    refreshServices()
    const channel = supabase
      .channel('public-site-services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_services' }, () => void refreshServices())
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setServicesError('Live service updates are unavailable. Reload the page to see recent changes.')
        }
      })

    return () => { void supabase.removeChannel(channel) }
  }, [refreshServices])

  const value = useMemo(() => ({
    services,
    activeServices: services.filter(service => service.isActive !== false),
    servicesError,
    loadingServices,
    refreshServices,
    setServices,
  }), [services, servicesError, loadingServices, refreshServices])

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}

export function useServices() {
  const context = useContext(ServicesContext)
  if (!context) throw new Error('useServices must be used within ServicesProvider.')
  return context
}
