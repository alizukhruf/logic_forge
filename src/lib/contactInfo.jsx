import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SITE } from '../data'
import { supabase } from './supabase'

const ContactInfoContext = createContext(null)

function normalizeContactInfo(record) {
  const phone = String(record.phone || '').replace(/\D/g, '')
  return {
    phone,
    phoneShow: phone ? `+${phone}` : SITE.phoneShow,
    email: record.email || SITE.email,
  }
}

export function ContactInfoProvider({ children }) {
  const [contactInfo, setContactInfo] = useState(SITE)
  const [contactInfoError, setContactInfoError] = useState('')
  const [loadingContactInfo, setLoadingContactInfo] = useState(true)

  const refreshContactInfo = useCallback(async () => {
    setContactInfoError('')
    try {
      const { data, error } = await supabase
        .from('site_contact_info')
        .select('phone,email')
        .eq('id', 'public')
        .maybeSingle()

      if (error) throw error
      if (data) setContactInfo(normalizeContactInfo(data))
    } catch (error) {
      setContactInfoError(error.message || 'Unable to load contact info from Supabase.')
      setContactInfo(SITE)
    } finally {
      setLoadingContactInfo(false)
    }
  }, [])

  useEffect(() => {
    refreshContactInfo()
    const channel = supabase
      .channel('public-site-contact-info')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_contact_info', filter: 'id=eq.public' }, () => void refreshContactInfo())
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setContactInfoError('Live contact information updates are unavailable. Reload the page to see recent changes.')
        }
      })

    return () => { void supabase.removeChannel(channel) }
  }, [refreshContactInfo])

  const saveContactInfo = useCallback(async values => {
    const phone = String(values.phone || '').replace(/\D/g, '')
    const email = String(values.email || '').trim()
    if (phone.length < 7 || phone.length > 15) throw new Error('Enter a phone number with 7 to 15 digits, including its country code.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.')

    const { error } = await supabase
      .from('site_contact_info')
      .upsert({ id: 'public', phone, email, updated_at: new Date().toISOString() }, { onConflict: 'id' })

    if (error) throw error
    const nextContactInfo = normalizeContactInfo({ phone, email })
    setContactInfo(nextContactInfo)
    setContactInfoError('')
    return nextContactInfo
  }, [])

  const value = useMemo(() => ({
    contactInfo,
    contactInfoError,
    loadingContactInfo,
    refreshContactInfo,
    saveContactInfo,
  }), [contactInfo, contactInfoError, loadingContactInfo, refreshContactInfo, saveContactInfo])

  return <ContactInfoContext.Provider value={value}>{children}</ContactInfoContext.Provider>
}

export function useContactInfo() {
  const context = useContext(ContactInfoContext)
  if (!context) throw new Error('useContactInfo must be used within ContactInfoProvider.')
  return context
}
