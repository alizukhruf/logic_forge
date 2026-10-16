import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SITE } from '../data'
import { supabase } from './supabase'

const ContactInfoContext = createContext(null)

export const SOCIAL_CONTACTS = [
  { key: 'telegram', name: 'Telegram', username: '@ZenVicSolutions', url: 'https://t.me/ZenVicSolutions' },
  { key: 'facebook', name: 'Facebook', username: 'Zenvic Solutions Page', url: 'https://www.facebook.com/zenvicsolutions' },
  { key: 'instagram', name: 'Instagram', username: '@zenvicsolutions', url: 'https://www.instagram.com/zenvicsolutions/' },
  { key: 'linkedin', name: 'LinkedIn', username: 'Zenvic Solutions', url: 'https://www.linkedin.com/company/zenvic-solutions/' },
]

function normalizeContactInfo(record) {
  const phone = String(record.phone || '').replace(/\D/g, '')
  return {
    phone,
    phoneShow: phone ? `+${phone}` : SITE.phoneShow,
    email: record.email || SITE.email,
    socials: SOCIAL_CONTACTS.map(({ key, name, username, url }) => ({
      key,
      name,
      username: record[`${key}_username`] || username,
      url: record[`${key}_url`] || url,
    })),
  }
}

function normalizeSocialUrl(value, label) {
  const url = String(value || '').trim()
  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new Error(`Enter a valid HTTPS URL for ${label}.`)
  }
  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`${label} link must start with https://.`)
  }
  return parsedUrl.toString()
}

export function ContactInfoProvider({ children }) {
  const [contactInfo, setContactInfo] = useState(() => normalizeContactInfo(SITE))
  const [contactInfoError, setContactInfoError] = useState('')
  const [loadingContactInfo, setLoadingContactInfo] = useState(true)

  const refreshContactInfo = useCallback(async () => {
    setContactInfoError('')
    try {
      const { data, error } = await supabase
        .from('site_contact_info')
        .select('phone,email,telegram_username,telegram_url,facebook_username,facebook_url,instagram_username,instagram_url,linkedin_username,linkedin_url')
        .eq('id', 'public')
        .maybeSingle()

      if (error) throw error
      if (data) setContactInfo(normalizeContactInfo(data))
    } catch (error) {
      setContactInfoError(error.message || 'Unable to load contact info from Supabase.')
      setContactInfo(normalizeContactInfo(SITE))
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

    const socialValues = {}
    for (const { key, name } of SOCIAL_CONTACTS) {
      const username = String(values[`${key}_username`] || '').trim()
      if (!username || username.length > 120) {
        throw new Error(`Enter an account name up to 120 characters for ${name}.`)
      }
      socialValues[`${key}_username`] = username
      socialValues[`${key}_url`] = normalizeSocialUrl(values[`${key}_url`], name)
    }

    const { error } = await supabase
      .from('site_contact_info')
      .upsert({ id: 'public', phone, email, ...socialValues, updated_at: new Date().toISOString() }, { onConflict: 'id' })

    if (error) throw error
    const nextContactInfo = normalizeContactInfo({ phone, email, ...socialValues })
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
