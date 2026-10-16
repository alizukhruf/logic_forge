import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CloudUpload,
  CircleUserRound,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquareText,
  Phone,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Send,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fetchShowcaseProjects, uploadShowcaseProjectImage } from '../lib/showcase'
import { toServiceRecord, useServices } from '../lib/services.jsx'
import { SOCIAL_CONTACTS, useContactInfo } from '../lib/contactInfo.jsx'
import { PasswordEditor, ProfileEditor, Seo } from '../components'
import { projects } from '../data'

const emptyServiceDraft = {
  slug: '',
  title: '',
  text: '',
  details: '',
  iconName: 'Briefcase',
  featuresText: '',
  displayOrder: 1,
  isActive: true,
}

const adminSections = [
  { path: '/admin', key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/profile', key: 'profile', label: 'My profile', icon: CircleUserRound },
  { path: '/admin/inquiries', key: 'inquiries', label: 'Inquiries', icon: Inbox },
  { path: '/admin/users', key: 'users', label: 'All users', icon: Users },
  { path: '/admin/showcase', key: 'showcase', label: 'Showcase', icon: Image },
  { path: '/admin/services', key: 'services', label: 'Services', icon: Settings },
  { path: '/admin/contact-info', key: 'contact-info', label: 'Contact info', icon: Phone },
]

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getInquiryStatus(inquiry) {
  return ['new', 'processing', 'completed', 'rejected', 'closed'].includes(inquiry?.status)
    ? inquiry.status
    : 'new'
}

export function AdminDashboard({ session, section = 'overview' }) {
  const navigate = useNavigate()
  const activeSection = adminSections.some(item => item.key === section) ? section : 'overview'
  const sectionTitle = adminSections.find(item => item.key === activeSection)?.label || 'Overview'
  const { services, servicesError, loadingServices, refreshServices } = useServices()
  const { contactInfo, contactInfoError, loadingContactInfo, saveContactInfo } = useContactInfo()
  const [inquiries, setInquiries] = useState([])
  const [users, setUsers] = useState([])
  const [adminProfile, setAdminProfile] = useState(null)
  const [adminProfileError, setAdminProfileError] = useState('')
  const [adminProfileLoading, setAdminProfileLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [userDeleteError, setUserDeleteError] = useState('')
  const [userDeleteStatus, setUserDeleteStatus] = useState('')
  const [deletingUser, setDeletingUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userInquiries, setUserInquiries] = useState([])
  const [userDetailsLoading, setUserDetailsLoading] = useState(false)
  const [userDetailsError, setUserDetailsError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('all')
  const [activeChatId, setActiveChatId] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [chatDraft, setChatDraft] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [showcaseStatus, setShowcaseStatus] = useState('')
  const [selectedShowcaseSlug, setSelectedShowcaseSlug] = useState(projects[0]?.slug || '')
  const [showcaseFile, setShowcaseFile] = useState(null)
  const [uploadingShowcaseImage, setUploadingShowcaseImage] = useState(false)
  const [uploadPreview, setUploadPreview] = useState('')
  const [storedShowcaseProjects, setStoredShowcaseProjects] = useState({})
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('')
  const [serviceDraft, setServiceDraft] = useState(emptyServiceDraft)
  const [serviceStatus, setServiceStatus] = useState('')
  const [savingService, setSavingService] = useState(false)
  const [deletingService, setDeletingService] = useState(false)
  const [contactDraft, setContactDraft] = useState(() => ({
    phone: contactInfo.phone,
    email: contactInfo.email,
    ...Object.fromEntries(SOCIAL_CONTACTS.flatMap(({ key }) => [
      [`${key}_username`, contactInfo.socials.find(social => social.key === key)?.username || ''],
      [`${key}_url`, contactInfo.socials.find(social => social.key === key)?.url || ''],
    ])),
  }))
  const [contactInfoStatus, setContactInfoStatus] = useState('')
  const [savingContactInfo, setSavingContactInfo] = useState(false)
  const fileInputRef = useRef(null)
  const userDetailsRequest = useRef(0)
  const chatRequest = useRef(0)

  const selectedShowcaseProject = projects.find(project => project.slug === selectedShowcaseSlug)
  const selectedStoredProject = storedShowcaseProjects[selectedShowcaseSlug]
  const selectedService = services.find(service => service.slug === selectedServiceSlug)

  useEffect(() => {
    if (activeSection !== 'profile') return undefined
    let active = true
    setAdminProfileLoading(true)
    setAdminProfileError('')

    const loadProfile = async () => {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, phone, role, created_at')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!active) return
      if (fetchError) setAdminProfileError(fetchError.message || 'Unable to load your profile.')
      else if (!data) setAdminProfileError('Your profile could not be found.')
      else {
        setAdminProfile(data)
        setAdminProfileError('')
      }
      setAdminProfileLoading(false)
    }

    void loadProfile().catch(fetchError => {
      if (active) {
        setAdminProfileError(fetchError.message || 'Unable to load your profile.')
        setAdminProfileLoading(false)
      }
    })
    const channel = supabase
      .channel(`admin-profile-${session.user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles', filter: `id=eq.${session.user.id}` }, () => void loadProfile())
      .subscribe(status => {
        if (active && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          setAdminProfileError('Live profile updates are unavailable. Reload the page to see recent changes.')
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [activeSection, session.user.id])

  useEffect(() => {
    if (activeSection !== 'contact-info' || loadingContactInfo) return
    setContactDraft({
      phone: contactInfo.phone,
      email: contactInfo.email,
      ...Object.fromEntries(SOCIAL_CONTACTS.flatMap(({ key }) => {
        const social = contactInfo.socials.find(item => item.key === key)
        return [[`${key}_username`, social?.username || ''], [`${key}_url`, social?.url || '']]
      })),
    })
  }, [activeSection, contactInfo, loadingContactInfo])

  useEffect(() => {
    if (activeSection !== 'services') return
    if (selectedServiceSlug === '__new__') {
      setServiceDraft(emptyServiceDraft)
      return
    }

    const service = services.find(item => item.slug === selectedServiceSlug)
    if (service) {
      setServiceDraft({
        slug: service.slug,
        title: service.title,
        text: service.text,
        details: service.details,
        iconName: service.iconName,
        featuresText: service.features.join('\n'),
        displayOrder: service.displayOrder,
        isActive: service.isActive,
      })
    } else if (!selectedServiceSlug && services.length) {
      setSelectedServiceSlug(services[0].slug)
    }
  }, [activeSection, selectedServiceSlug, services])

  useEffect(() => {
    if (activeSection !== 'showcase') return undefined
    if (!showcaseFile) {
      setUploadPreview('')
      return undefined
    }

    const previewUrl = URL.createObjectURL(showcaseFile)
    setUploadPreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [activeSection, showcaseFile])

  useEffect(() => {
    if (activeSection !== 'showcase') return undefined
    let active = true

    const refreshShowcase = () => fetchShowcaseProjects()
      .then(showcaseProjects => {
        if (active) setStoredShowcaseProjects(showcaseProjects)
      })
      .catch(loadError => {
        if (active) {
          setShowcaseStatus(`Could not load saved showcase images: ${loadError.message}`)
        }
      })

    void refreshShowcase()
    const channel = supabase
      .channel('admin-showcase-projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_showcase_projects' }, () => void refreshShowcase())
      .subscribe(status => {
        if (active && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          setShowcaseStatus('Live showcase updates are unavailable. Reload this page to see recent changes.')
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'users') return undefined
    let active = true

    const loadUsers = async () => {
      setUsersLoading(true)
      setUsersError('')
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, phone, role, created_at')
        .order('created_at', { ascending: false })

      if (!active) return
      if (fetchError) {
        setUsersError(fetchError.message || 'Unable to load registered users.')
      } else {
        setUsers(data || [])
        setSelectedUser(current => current
          ? (data || []).find(user => user.id === current.id) || current
          : current)
      }
      setUsersLoading(false)
    }

    void loadUsers()
    const channel = supabase
      .channel('admin-user-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => void loadUsers())
      .subscribe(status => {
        if (active && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          setUsersError('Live updates are unavailable. Reload the user directory to see recent changes.')
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [activeSection, reloadKey])

  useEffect(() => {
    if (activeSection !== 'inquiries' || !activeChatId) return undefined
    let active = true
    const requestId = ++chatRequest.current

    let initialLoad = true
    const loadMessages = async () => {
      if (initialLoad) setChatLoading(true)
      const { data, error: fetchError } = await supabase
        .from('inquiry_messages')
        .select('id, inquiry_id, sender_id, sender_role, body, created_at')
        .eq('inquiry_id', activeChatId)
        .order('created_at', { ascending: true })

      if (!active || requestId !== chatRequest.current) return
      if (fetchError) {
        setChatError(fetchError.message || 'Unable to load this conversation.')
      } else {
        setChatMessages(data || [])
        setChatError('')
      }
      setChatLoading(false)
      initialLoad = false
    }

    void loadMessages()
    const channel = supabase
      .channel(`admin-inquiry-chat-${activeChatId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiry_messages', filter: `inquiry_id=eq.${activeChatId}` }, () => void loadMessages())
      .subscribe(status => {
        if (active && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          setChatError('Live chat updates are unavailable. Close and reopen this conversation to reload it.')
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [activeChatId, activeSection])

  useEffect(() => {
    if (activeSection !== 'users' || !selectedUser) return undefined
    let active = true
    const refreshUserInquiries = async () => {
      const { data, error: fetchError } = await supabase
        .from('project_inquiries')
        .select('*')
        .eq('user_id', selectedUser.id)
        .order('created_at', { ascending: false })

      if (!active) return
      if (fetchError) setUserDetailsError(fetchError.message || 'Unable to refresh this user’s inquiries.')
      else {
        setUserInquiries(data || [])
        setUserDetailsError('')
      }
    }

    const channel = supabase
      .channel(`admin-user-inquiries-${selectedUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_inquiries', filter: `user_id=eq.${selectedUser.id}` }, () => void refreshUserInquiries())
      .subscribe(status => {
        if (active && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          setUserDetailsError('Live inquiry updates are unavailable. Close and reopen this user to reload their inquiries.')
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [activeSection, selectedUser])

  const summary = useMemo(() => {
    const total = inquiries.length
    const recent = inquiries.filter(item => {
      const createdAt = new Date(item.created_at)
      const daysAgo = Date.now() - createdAt.getTime()
      return daysAgo < 1000 * 60 * 60 * 24 * 7
    }).length
    const unread = inquiries.filter(item => !item.is_read).length
    const services = inquiries.reduce((acc, item) => {
      const service = item.service || 'Unspecified'
      acc[service] = (acc[service] || 0) + 1
      return acc
    }, {})

    return {
      total,
      recent,
      unread,
      services: Object.entries(services)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4),
    }
  }, [inquiries])

  useEffect(() => {
    if (!session) {
      navigate('/admin/login', { replace: true })
      return
    }
    if (activeSection !== 'overview' && activeSection !== 'inquiries') {
      setLoading(false)
      return
    }

    const loadInquiries = async () => {
      setLoading(true)
      setError('')

      try {
        const { data, error: fetchError } = await supabase
          .from('project_inquiries')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) {
          const isMissingTable = fetchError.code === '42P01' || /does not exist|schema cache/i.test(fetchError.message)
          setError(isMissingTable
            ? "Could not find the table 'public.project_inquiries' in the schema cache"
            : fetchError.message || 'Unable to load inquiries.')
          return
        }

        setInquiries(data || [])
      } catch (fetchError) {
        setError(fetchError?.message || 'Unable to load inquiries.')
      } finally {
        setLoading(false)
      }
    }

    void loadInquiries()
    const channel = supabase
      .channel('admin-project-inquiries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_inquiries' }, () => void loadInquiries())
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError('Live inquiry updates are unavailable. Reload this page to see recent changes.')
        }
      })
    return () => { void supabase.removeChannel(channel) }
  }, [activeSection, navigate, reloadKey, session])

  const filteredInquiries = useMemo(() => {
    const needle = search.trim().toLowerCase()

    return inquiries.filter(inquiry => {
      const matchesView = view === 'all' || (view === 'unread' ? !inquiry.is_read : inquiry.is_read)
      const queryText = `${inquiry.name || ''} ${inquiry.email || ''} ${inquiry.service || ''} ${inquiry.business_name || ''}`.toLowerCase()
      const matchesSearch = !needle || queryText.includes(needle)

      return matchesView && matchesSearch
    })
  }, [inquiries, search, view])

  const toggleRead = async (inquiry) => {
    const nextRead = !inquiry.is_read

    const { error: updateError } = await supabase
      .from('project_inquiries')
      .update({ is_read: nextRead })
      .eq('id', inquiry.id)

    if (updateError) {
      setError(updateError.message || 'Unable to update inquiry status.')
      return
    }

    setInquiries(current => current.map(item => item.id === inquiry.id ? { ...item, is_read: nextRead } : item))
  }

  const updateInquiryStatus = async (inquiry, status) => {
    setUpdatingStatusId(inquiry.id)
    setError('')
    const { error: updateError } = await supabase
      .from('project_inquiries')
      .update({ status })
      .eq('id', inquiry.id)

    if (updateError) {
      setError(updateError.message || 'Unable to update inquiry status.')
    } else {
      setInquiries(current => current.map(item => item.id === inquiry.id ? { ...item, status } : item))
    }
    setUpdatingStatusId('')
  }

  const sendInquiryReply = async (event, inquiry) => {
    event.preventDefault()
    const body = chatDraft.trim()
    if (!body || sendingReply || !session?.user?.id) return

    setSendingReply(true)
    setChatError('')
    const { data, error: insertError } = await supabase
      .from('inquiry_messages')
      .insert({
        inquiry_id: inquiry.id,
        sender_id: session.user.id,
        sender_role: 'admin',
        body,
      })
      .select('id, inquiry_id, sender_id, sender_role, body, created_at')
      .single()

    if (insertError) {
      setChatError(insertError.message || 'Unable to send the reply.')
    } else {
      setChatMessages(current => [...current, data])
      setChatDraft('')
    }
    setSendingReply(false)
  }

  const deleteInquiry = async (id) => {
    const { error: deleteError } = await supabase
      .from('project_inquiries')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message || 'Unable to delete inquiry.')
      return
    }

    setInquiries(current => current.filter(item => item.id !== id))
  }

  const openUserDetails = async user => {
    const requestId = ++userDetailsRequest.current
    setSelectedUser(user)
    setUserDeleteError('')
    setUserInquiries([])
    setUserDetailsError('')
    setUserDetailsLoading(true)

    const { data, error: fetchError } = await supabase
      .from('project_inquiries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (requestId !== userDetailsRequest.current) return
    if (fetchError) {
      setUserDetailsError(fetchError.message || 'Unable to load this user’s inquiries.')
    } else {
      setUserInquiries(data || [])
    }
    setUserDetailsLoading(false)
  }

  const closeUserDetails = () => {
    userDetailsRequest.current += 1
    setSelectedUser(null)
    setUserInquiries([])
    setUserDetailsError('')
  }

  const updateSelectedUser = updatedProfile => {
    setSelectedUser(updatedProfile)
    setUsers(current => current.map(user => user.id === updatedProfile.id ? updatedProfile : user))
  }

  const deleteSelectedUser = async () => {
    if (!selectedUser || selectedUser.role !== 'user' || deletingUser) return
    const userToDelete = selectedUser
    const confirmed = window.confirm(
      `Permanently delete ${userToDelete.full_name || userToDelete.email}'s account? Their inquiries will remain unassigned, and their chat messages will be removed. This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingUser(true)
    setUserDeleteError('')
    setUserDeleteStatus('')
    try {
      const { error: deleteError } = await supabase.rpc('delete_site_user', {
        target_user_id: userToDelete.id,
      })
      if (deleteError) throw deleteError

      setUsers(current => current.filter(user => user.id !== userToDelete.id))
      setUserDeleteStatus(`Deleted ${userToDelete.email}'s account. Their inquiries remain in the dashboard without an account link.`)
      closeUserDetails()
    } catch (deleteError) {
      setUserDeleteError(
        `${deleteError.message || 'Unable to delete this account.'} Confirm that supabase/admin_user_management.sql has been run in the Supabase SQL Editor.`
      )
    } finally {
      setDeletingUser(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const uploadSelectedImage = async event => {
    event.preventDefault()
    setShowcaseStatus('')

    if (!selectedShowcaseProject || !showcaseFile) {
      setShowcaseStatus('Choose a project category and an image before uploading.')
      return
    }

    setUploadingShowcaseImage(true)
    try {
      const image = await uploadShowcaseProjectImage(selectedShowcaseProject, showcaseFile)
      setStoredShowcaseProjects(current => ({
        ...current,
        [selectedShowcaseSlug]: {
          ...selectedShowcaseProject,
          image,
          imageAlt: `${selectedShowcaseProject.name} showcase screenshot`,
        },
      }))
      setShowcaseStatus(`Image uploaded and database updated for ${selectedShowcaseProject.cat}.`)
      setShowcaseFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (uploadError) {
      setShowcaseStatus(uploadError.message || 'Unable to upload the showcase image.')
    } finally {
      setUploadingShowcaseImage(false)
    }
  }

  const saveService = async event => {
    event.preventDefault()
    setServiceStatus('')

    const slug = serviceDraft.slug.trim()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setServiceStatus('Use a lowercase URL slug with words separated by hyphens.')
      return
    }
    if (!serviceDraft.title.trim() || !serviceDraft.text.trim() || !serviceDraft.details.trim()) {
      setServiceStatus('Enter a title, summary, and service details before saving.')
      return
    }

    setSavingService(true)
    try {
      const record = toServiceRecord({
        ...serviceDraft,
        slug,
        features: serviceDraft.featuresText.split('\n').map(feature => feature.trim()).filter(Boolean),
      })
      const { error: saveError } = await supabase.from('site_services').upsert(record)
      if (saveError) throw saveError

      await refreshServices()
      setSelectedServiceSlug(slug)
      setServiceStatus(`Service "${serviceDraft.title.trim()}" saved to Supabase.`)
    } catch (saveError) {
      setServiceStatus(saveError.message || 'Unable to save the service.')
    } finally {
      setSavingService(false)
    }
  }

  const deleteSelectedService = async () => {
    if (!selectedService) return
    if (!window.confirm(`Delete "${selectedService.title}" from the service catalog?`)) return

    setDeletingService(true)
    setServiceStatus('')
    try {
      const { error: deleteError } = await supabase
        .from('site_services')
        .delete()
        .eq('slug', selectedService.slug)
      if (deleteError) throw deleteError

      await refreshServices()
      setSelectedServiceSlug('')
      setServiceStatus(`Service "${selectedService.title}" deleted.`)
    } catch (deleteError) {
      setServiceStatus(deleteError.message || 'Unable to delete the service.')
    } finally {
      setDeletingService(false)
    }
  }

  const updateContactInfo = async event => {
    event.preventDefault()
    setContactInfoStatus('')
    setSavingContactInfo(true)
    try {
      const updated = await saveContactInfo(contactDraft)
      setContactDraft({
        phone: updated.phone,
        email: updated.email,
        ...Object.fromEntries(updated.socials.flatMap(({ key, username, url }) => [
          [`${key}_username`, username],
          [`${key}_url`, url],
        ])),
      })
      setContactInfoStatus('Contact information saved and published across the site.')
    } catch (saveError) {
      setContactInfoStatus(saveError.message || 'Unable to save contact information.')
    } finally {
      setSavingContactInfo(false)
    }
  }

  return (
    <>
      <Seo title={`Admin ${sectionTitle}`} desc={`${sectionTitle} management for Logic Forge.`} noindex />
      <section className="admin-shell min-h-screen py-10 text-white sm:py-14">
        <div className="wrap relative z-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-200/90">Logic Forge · Admin</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-[4rem] sm:leading-[0.95]">{sectionTitle}</h1>
            </div>
            <button type="button" onClick={handleSignOut} className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-lg font-semibold text-white shadow-[0_0_30px_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:bg-white/10">
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>

          <nav aria-label="Admin navigation" className="admin-card mb-8 flex flex-wrap gap-2 !p-2">
            {adminSections.map(item => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end={item.key === 'overview'}
                  className={({ isActive }) => `inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${isActive ? 'bg-gradient-to-r from-electric to-cyan text-white shadow-lg' : 'text-sky-100/75 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={17} aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          {activeSection === 'overview' && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <NavLink to="/admin/inquiries" className="admin-card group transition hover:border-sky-300/40">
                  <MessageSquareText className="mb-5 h-8 w-8 text-sky-200" />
                  <p className="text-sm font-semibold text-sky-100/70">Project inquiries</p>
                  <p className="mt-2 text-4xl font-black text-white">{loading ? '…' : summary.total}</p>
                  <p className="mt-3 text-sm text-sky-100/70">{summary.unread} unread · {summary.recent} received this week</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan">Manage inquiries <ArrowUpRight size={15} /></span>
                </NavLink>
                <NavLink to="/admin/users" className="admin-card group transition hover:border-sky-300/40">
                  <Users className="mb-5 h-8 w-8 text-sky-200" />
                  <p className="text-sm font-semibold text-sky-100/70">Registered accounts</p>
                  <p className="mt-2 text-xl font-black text-white">User directory</p>
                  <p className="mt-3 text-sm text-sky-100/70">Review account details and any inquiries linked to each user.</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan">View all users <ArrowUpRight size={15} /></span>
                </NavLink>
                <NavLink to="/admin/showcase" className="admin-card group transition hover:border-sky-300/40">
                  <Image className="mb-5 h-8 w-8 text-sky-200" />
                  <p className="text-sm font-semibold text-sky-100/70">Project showcase</p>
                  <p className="mt-2 text-xl font-black text-white">Website screenshots</p>
                  <p className="mt-3 text-sm text-sky-100/70">Preview and replace a project image.</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan">Manage showcase <ArrowUpRight size={15} /></span>
                </NavLink>
                <NavLink to="/admin/services" className="admin-card group transition hover:border-sky-300/40">
                  <Settings className="mb-5 h-8 w-8 text-sky-200" />
                  <p className="text-sm font-semibold text-sky-100/70">Service catalog</p>
                  <p className="mt-2 text-4xl font-black text-white">{services.filter(service => service.isActive).length}</p>
                  <p className="mt-3 text-sm text-sky-100/70">Active services shown on the public website.</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan">Manage services <ArrowUpRight size={15} /></span>
                </NavLink>
                <NavLink to="/admin/contact-info" className="admin-card group transition hover:border-sky-300/40">
                  <Phone className="mb-5 h-8 w-8 text-sky-200" />
                  <p className="text-sm font-semibold text-sky-100/70">Public contact info</p>
                  <p className="mt-2 break-all text-xl font-black text-white">{contactInfo.email}</p>
                  <p className="mt-2 text-sm text-sky-100/70">{contactInfo.phoneShow}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan">Edit contact info <ArrowUpRight size={15} /></span>
                </NavLink>
              </div>
              {error && (
                <p role="alert" className="mt-6 rounded-xl border border-amber-300/30 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
                  Inquiry summary unavailable: {error} Open Inquiries to retry or check its setup instructions.
                </p>
              )}
            </>
          )}

          {activeSection === 'users' && (
            <section aria-labelledby="users-heading">
              {userDeleteStatus && <p role="status" className="admin-card mb-6 border-emerald-300/20 text-emerald-100">{userDeleteStatus}</p>}
              <div className="admin-card mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="users-heading" className="text-xl font-bold text-white">Registered users</h2>
                  <p className="mt-1 text-sm text-sky-100/70">Select a user to review their profile and submitted inquiries.</p>
                </div>
                {!usersLoading && !usersError && <p className="text-sm font-semibold text-sky-100/70">{users.length} account{users.length === 1 ? '' : 's'}</p>}
              </div>

              {usersError && (
                <div role="alert" className="admin-card border-red-300/30 text-red-100">
                  <p className="font-semibold">{usersError}</p>
                  <p className="mt-2 text-sm text-red-100/75">Run <code className="rounded bg-black/20 px-1">supabase/user_accounts.sql</code> after the user accounts setup, then retry.</p>
                  <button type="button" onClick={() => setReloadKey(key => key + 1)} className="mt-4 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10">Retry</button>
                </div>
              )}

              {usersLoading ? (
                <div className="admin-card text-center text-sky-100/80">Loading users…</div>
              ) : !usersError && users.length === 0 ? (
                <div className="admin-card text-center text-sky-100/80">No user accounts have signed up yet.</div>
              ) : !usersError && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {users.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => openUserDetails(user)}
                      className="admin-card text-left transition hover:border-cyan/40 hover:bg-white/[0.09] focus-visible:outline-cyan"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-400/15 text-sky-100"><CircleUserRound size={22} /></span>
                          <span className="min-w-0">
                            <span className="block truncate font-bold text-white">{user.full_name || 'Name not provided'}</span>
                            <span className="mt-1 block truncate text-sm text-sky-100/65">{user.email}</span>
                          </span>
                        </span>
                        <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/15 bg-white/5 text-sky-100/65'}`}>{user.role}</span>
                      </span>
                      <span className="mt-4 flex items-center gap-2 text-xs text-sky-100/55"><CalendarDays size={14} /> Joined {formatDate(user.created_at)}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === 'profile' && (
            <section className="admin-card max-w-3xl" aria-labelledby="admin-profile-heading">
              <h2 id="admin-profile-heading" className="text-xl font-bold text-white">Administrator profile</h2>
              <p className="mt-2 text-sm text-sky-100/70">Update your personal details and password. Your email and administrator role are managed separately.</p>
              {adminProfileLoading ? (
                <p className="mt-5 text-sm text-sky-100/70">Loading your profile…</p>
              ) : adminProfileError ? (
                <p role="alert" className="mt-5 rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-100">{adminProfileError}. Run <code>supabase/user_accounts.sql</code> if the profile table is unavailable.</p>
              ) : adminProfile && (
                <>
                  <ProfileEditor profile={adminProfile} onSaved={setAdminProfile} />
                  <PasswordEditor email={adminProfile.email} />
                  <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                    <p className="text-sm"><span className="block text-xs font-semibold uppercase tracking-wider text-sky-100/50">Account role</span><span className="mt-1 block font-semibold capitalize">{adminProfile.role}</span></p>
                    <p className="text-sm"><span className="block text-xs font-semibold uppercase tracking-wider text-sky-100/50">Member since</span><span className="mt-1 block font-semibold">{formatDate(adminProfile.created_at)}</span></p>
                  </div>
                </>
              )}
            </section>
          )}

          {activeSection === 'showcase' && (
            <>
          <div className="admin-card mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Website screenshots</h2>
              <p className="mt-1 max-w-2xl text-sm text-sky-100/70">
                Run <code className="rounded bg-black/20 px-1">supabase/site_showcase.sql</code> first. Choose a project below to preview its current screenshot or upload a replacement.
              </p>
            </div>
          </div>

          <form onSubmit={uploadSelectedImage} className="admin-card mb-8 grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-sky-100">Project category</span>
              <select
                value={selectedShowcaseSlug}
                onChange={event => {
                  setSelectedShowcaseSlug(event.target.value)
                  setShowcaseStatus('')
                }}
                className="field"
              >
                {projects.map(project => (
                  <option key={project.slug} value={project.slug} className="bg-[#0B0720]">
                    {project.cat} — {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-sky-100">Replace screenshot (JPG, PNG, or WebP; max 5 MB)</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={event => {
                  setShowcaseFile(event.target.files?.[0] || null)
                  setShowcaseStatus('')
                }}
                className="block w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-sky-100 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500/30 file:px-3 file:py-2 file:font-semibold file:text-white"
              />
              {uploadPreview && (
                <img src={uploadPreview} alt="Selected showcase image preview" className="mt-3 aspect-[16/10] w-full rounded-xl bg-white object-contain" />
              )}
            </label>

            <button
              type="submit"
              disabled={uploadingShowcaseImage || !showcaseFile}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200/20 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CloudUpload className="h-4 w-4" />
              {uploadingShowcaseImage ? 'Uploading…' : 'Upload & update'}
            </button>
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,360px)] lg:col-span-3 lg:items-center">
              <div>
                <h3 className="font-bold text-white">Current {selectedShowcaseProject?.cat} screenshot</h3>
                <p className="mt-1 text-sm text-sky-100/70">
                  {selectedStoredProject?.image ? 'Showing the screenshot saved in Supabase.' : 'Showing the bundled demo screenshot. Upload a replacement to save it in Supabase.'}
                </p>
              </div>
              {selectedShowcaseProject && (
                <img
                  src={selectedStoredProject?.image || selectedShowcaseProject.imageSrc}
                  alt={selectedStoredProject?.imageAlt || selectedShowcaseProject.imageAlt}
                  className="aspect-[16/10] w-full rounded-xl border border-white/10 bg-white object-contain"
                />
              )}
            </div>
          </form>

          {showcaseStatus && (
            <p role="status" className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-sky-100">
              {showcaseStatus}
            </p>
          )}
            </>
          )}

          {activeSection === 'services' && (
          <section className="admin-card mb-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Service catalog</h2>
                <p className="mt-1 text-sm text-sky-100/70">Edit the public service cards and detail pages. Changes are saved to Supabase.</p>
              </div>
              <div className="flex gap-3">
                <label className="min-w-48 flex-1">
                  <span className="sr-only">Choose service to edit</span>
                  <select
                    value={selectedServiceSlug}
                    onChange={event => {
                      setSelectedServiceSlug(event.target.value)
                      setServiceStatus('')
                    }}
                    className="field"
                  >
                    <option value="" className="bg-[#0B0720]">Choose a service</option>
                    {services.map(service => (
                      <option key={service.slug} value={service.slug} className="bg-[#0B0720]">
                        {service.title}{service.isActive ? '' : ' (hidden)'}
                      </option>
                    ))}
                    <option value="__new__" className="bg-[#0B0720]">+ Add new service</option>
                  </select>
                </label>
                <button type="button" onClick={() => { setSelectedServiceSlug('__new__'); setServiceStatus('') }} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  New service
                </button>
              </div>
            </div>

            {servicesError && (
              <p role="alert" className="mb-4 rounded-xl border border-amber-300/30 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
                Could not load the service catalog from Supabase: {servicesError}. Run <code>supabase/services.sql</code> in the project SQL editor, then reload.
              </p>
            )}

            <form onSubmit={saveService} className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-sky-100">URL slug</span>
                <input value={serviceDraft.slug} onChange={event => setServiceDraft(current => ({ ...current, slug: event.target.value }))} disabled={Boolean(selectedService)} required className="field disabled:opacity-60" placeholder="website-design" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-sky-100">Service title</span>
                <input value={serviceDraft.title} onChange={event => setServiceDraft(current => ({ ...current, title: event.target.value }))} required className="field" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-sky-100">Card summary</span>
                <textarea value={serviceDraft.text} onChange={event => setServiceDraft(current => ({ ...current, text: event.target.value }))} required rows={2} className="field" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-sky-100">Full service details</span>
                <textarea value={serviceDraft.details} onChange={event => setServiceDraft(current => ({ ...current, details: event.target.value }))} required rows={3} className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-sky-100">Card icon</span>
                <select value={serviceDraft.iconName} onChange={event => setServiceDraft(current => ({ ...current, iconName: event.target.value }))} className="field">
                  {['Briefcase', 'LifeBuoy', 'Palette', 'RefreshCw', 'Rocket', 'Search', 'ShoppingCart', 'Smartphone'].map(icon => <option key={icon} value={icon} className="bg-[#0B0720]">{icon}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-sky-100">Display order</span>
                <input type="number" min="0" step="1" value={serviceDraft.displayOrder} onChange={event => setServiceDraft(current => ({ ...current, displayOrder: Number(event.target.value) }))} className="field" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-sky-100">Included features (one per line)</span>
                <textarea value={serviceDraft.featuresText} onChange={event => setServiceDraft(current => ({ ...current, featuresText: event.target.value }))} rows={4} className="field" />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-sky-100 md:col-span-2">
                <input type="checkbox" checked={serviceDraft.isActive} onChange={event => setServiceDraft(current => ({ ...current, isActive: event.target.checked }))} className="h-4 w-4 accent-cyan" />
                Show this service on the public website
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={savingService || loadingServices} className="rounded-xl bg-gradient-to-r from-electric to-cyan px-5 py-3 font-bold text-white disabled:opacity-50">
                  {savingService ? 'Saving…' : 'Save service'}
                </button>
                {selectedService && (
                  <button type="button" onClick={deleteSelectedService} disabled={deletingService} className="inline-flex items-center gap-2 rounded-xl border border-red-300/30 px-5 py-3 font-bold text-red-100 hover:bg-red-400/10 disabled:opacity-50">
                    <Trash2 size={16} /> {deletingService ? 'Deleting…' : 'Delete service'}
                  </button>
                )}
              </div>
            </form>
            {serviceStatus && <p role="status" className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-sky-100">{serviceStatus}</p>}
          </section>
          )}

          {activeSection === 'contact-info' && (
            <section className="admin-card max-w-3xl">
              <h2 className="text-xl font-bold text-white">Public contact information</h2>
              <p className="mt-2 text-sm text-sky-100/70">
                These details are used by the public contact page, WhatsApp links, and site footer.
              </p>
              {contactInfoError && (
                <p role="alert" className="mt-5 rounded-xl border border-amber-300/30 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
                  Could not load saved contact info: {contactInfoError}. Run <code>supabase/contact_info.sql</code> in the Supabase project SQL editor, then reload.
                </p>
              )}
              <form onSubmit={updateContactInfo} className="mt-6 grid gap-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-sky-100">Phone / WhatsApp number</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={contactDraft.phone}
                    onChange={event => setContactDraft(current => ({ ...current, phone: event.target.value }))}
                    placeholder="923001234567"
                    required
                    className="field"
                  />
                  <span className="mt-2 block text-xs text-sky-100/60">Include country code. Spaces and punctuation are removed when saved.</span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-sky-100">Public email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={contactDraft.email}
                    onChange={event => setContactDraft(current => ({ ...current, email: event.target.value }))}
                    placeholder="hello@example.com"
                    required
                    className="field"
                  />
                </label>
                <fieldset className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 sm:p-5">
                  <legend className="px-2 text-sm font-bold text-white">Social accounts</legend>
                  {SOCIAL_CONTACTS.map(({ key, name }) => (
                    <div key={key} className="grid gap-3">
                      <h3 className="text-sm font-bold text-sky-100">{name}</h3>
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold text-sky-100/70">Account name / username</span>
                        <input
                          value={contactDraft[`${key}_username`]}
                          onChange={event => setContactDraft(current => ({ ...current, [`${key}_username`]: event.target.value }))}
                          required
                          maxLength={120}
                          className="field"
                          placeholder={name}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold text-sky-100/70">Profile URL</span>
                        <input
                          type="url"
                          value={contactDraft[`${key}_url`]}
                          onChange={event => setContactDraft(current => ({ ...current, [`${key}_url`]: event.target.value }))}
                          required
                          maxLength={2048}
                          className="field"
                          placeholder="https://"
                        />
                      </label>
                    </div>
                  ))}
                  <p className="text-xs text-sky-100/60 sm:col-span-2">Use an https:// profile link. Changes publish to the Contact and About pages after saving.</p>
                </fieldset>
                <div>
                  <button type="submit" disabled={savingContactInfo || loadingContactInfo} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric to-cyan px-5 py-3 font-bold text-white disabled:opacity-50">
                    <Save size={17} aria-hidden="true" />
                    {savingContactInfo ? 'Saving…' : 'Save contact info'}
                  </button>
                </div>
              </form>
              {contactInfoStatus && <p role="status" className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-sky-100">{contactInfoStatus}</p>}
            </section>
          )}

          {activeSection === 'inquiries' && (
            <>
          <div className="grid gap-5 md:grid-cols-4">
            <div className="admin-card">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/80">Total</p>
              <div className="mt-8 flex items-end justify-between">
                <span className="text-5xl font-black leading-none text-white">{summary.total}</span>
                <BriefcaseBusiness className="h-8 w-8 text-sky-200" />
              </div>
            </div>

            <div className="admin-card">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/80">This week</p>
              <div className="mt-8 flex items-end justify-between">
                <span className="text-5xl font-black leading-none text-white">{summary.recent}</span>
                <MessageSquareText className="h-8 w-8 text-sky-200" />
              </div>
            </div>

            <div className="admin-card">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/80">Unread</p>
              <div className="mt-8 flex items-end justify-between">
                <span className="text-5xl font-black leading-none text-white">{summary.unread}</span>
                <ShieldCheck className="h-8 w-8 text-sky-200" />
              </div>
            </div>

            <div className="admin-card">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/80">Service mix</p>
              <div className="mt-7 text-base text-sky-100/90">
                {summary.services.length ? summary.services.map(([label, count]) => (
                  <div key={label} className="mb-3 flex items-center justify-between gap-4 last:mb-0">
                    <span>{label}</span>
                    <span className="font-bold text-sky-200">{count}</span>
                  </div>
                )) : <span className="text-sky-100/70">No data yet</span>}
              </div>
            </div>
          </div>
            </>
          )}

          {activeSection === 'inquiries' && (
            <>
          {error && (
            <div className="mt-7 rounded-2xl border border-red-400/70 bg-[rgba(127,29,29,0.18)] px-5 py-4 text-red-100 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-sm">
              <p className="text-lg font-semibold">{error}</p>
              {(error.includes('Could not find the table') || error.includes('schema cache')) && (
                <p className="mt-2 text-sm leading-relaxed text-red-100/80">
                  In Supabase, run <code className="rounded bg-black/20 px-1.5 py-0.5">supabase/user_accounts.sql</code> first, then <code className="rounded bg-black/20 px-1.5 py-0.5">supabase/project_inquiries.sql</code>, then retry. If you just created the table, wait briefly for the API schema cache to refresh.
                </p>
              )}
              <button
                type="button"
                onClick={() => setReloadKey(key => key + 1)}
                className="mt-4 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Retry loading
              </button>
            </div>
          )}

          {!error && !loading && (
            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_0_30px_rgba(76,29,149,0.15)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-200/80" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, email, service..."
                    className="w-full rounded-2xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-base text-white placeholder:text-sky-100/50 focus:border-sky-300/60 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'unread', 'read'].map(filter => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setView(filter)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                        view === filter ? 'bg-sky-500/30 text-white ring-1 ring-sky-200/40' : 'bg-white/5 text-sky-100/80 hover:bg-white/10'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!error && (
            <div className="mt-8">
              {loading ? (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 text-center text-2xl text-sky-100/85">Loading inquiries…</div>
              ) : filteredInquiries.length === 0 ? (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 text-center text-2xl text-sky-100/85">
                  No inquiries match your current filter.
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredInquiries.map((inquiry) => {
                    const status = getInquiryStatus(inquiry)
                    const isRead = Boolean(inquiry.is_read)

                    return (
                      <article key={inquiry.id} className="admin-card p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-xl font-bold text-white">{inquiry.name}</h2>
                              <span className="rounded-full border border-sky-300/40 bg-sky-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-200">
                                {inquiry.service || 'General inquiry'}
                              </span>
                              <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${status === 'completed' ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200' : status === 'rejected' ? 'border-red-400/40 bg-red-500/10 text-red-200' : status === 'processing' ? 'border-amber-400/40 bg-amber-500/10 text-amber-200' : 'border-sky-300/40 bg-sky-500/10 text-sky-200'}`}>
                                {status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-sky-100/60">Submitted {formatDate(inquiry.created_at)}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-sky-100/70">
                              Status
                              <select
                                value={status}
                                onChange={event => void updateInquiryStatus(inquiry, event.target.value)}
                                disabled={updatingStatusId === inquiry.id}
                                className="rounded-full border border-white/15 bg-[#171126] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                                aria-label={`Update status for ${inquiry.name}'s inquiry`}
                              >
                                {['new', 'processing', 'completed', 'rejected', 'closed'].map(value => (
                                  <option key={value} value={value} className="bg-[#0B0720]">{value[0].toUpperCase() + value.slice(1)}</option>
                                ))}
                              </select>
                            </label>
                            <button
                              type="button"
                              onClick={() => toggleRead(inquiry)}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-100 hover:bg-white/10"
                            >
                              {isRead ? 'Mark unread' : 'Mark read'}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-100 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div className="space-y-3 text-sm text-sky-100/80">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-sky-200" />
                              <span>{inquiry.email || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ArrowUpRight className="h-4 w-4 text-sky-200" />
                              <span>{inquiry.phone || 'No phone provided'}</span>
                            </div>
                          </div>

                          <div className="space-y-3 text-sm text-sky-100/80">
                            <p><span className="font-semibold text-white">Business:</span> {inquiry.business_name || 'Not provided'}</p>
                            <p><span className="font-semibold text-white">Budget:</span> {inquiry.budget || 'Not specified'}</p>
                            <p><span className="font-semibold text-white">Timeline:</span> {inquiry.timeline || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-sky-100/80">
                          <span className="mb-2 block font-semibold uppercase tracking-[0.18em] text-sky-200">Project details</span>
                          <p className="whitespace-pre-wrap leading-relaxed">{inquiry.details || 'No project details provided.'}</p>
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="inline-flex items-center gap-2 font-bold text-white"><MessageCircle size={18} className="text-cyan" /> Conversation</h3>
                            {inquiry.user_id ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (activeChatId === inquiry.id) {
                                    chatRequest.current += 1
                                    setActiveChatId('')
                                    setChatMessages([])
                                  } else {
                                    setChatMessages([])
                                    setChatDraft('')
                                    setActiveChatId(inquiry.id)
                                  }
                                }}
                                className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan/20"
                              >
                                {activeChatId === inquiry.id ? 'Close chat' : 'Open chat'}
                              </button>
                            ) : (
                              <p className="text-xs text-sky-100/55">This inquiry is not linked to a registered account.</p>
                            )}
                          </div>

                          {activeChatId === inquiry.id && (
                            <div className="mt-4">
                              {chatError && <p role="alert" className="mb-3 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">{chatError}. Run the latest <code>supabase/project_inquiries.sql</code> migration if the messages table is unavailable.</p>}
                              <div className="max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/10 p-4" aria-live="polite">
                                {chatLoading ? <p className="py-4 text-center text-sm text-sky-100/60">Loading conversation…</p> : chatMessages.length ? chatMessages.map(message => (
                                  <div key={message.id} className={`flex ${message.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[80%] ${message.sender_role === 'admin' ? 'bg-electric/30 text-white' : 'border border-white/10 bg-white/[0.06] text-sky-50'}`}>
                                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/55">{message.sender_role === 'admin' ? 'Logic Forge team' : inquiry.name}</p>
                                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.body}</p>
                                      <p className="mt-2 text-right text-[10px] text-white/45">{formatDate(message.created_at)}</p>
                                    </div>
                                  </div>
                                )) : <p className="py-4 text-center text-sm text-sky-100/60">No messages yet. Send the first reply to this user.</p>}
                              </div>
                              <form onSubmit={event => void sendInquiryReply(event, inquiry)} className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <textarea
                                  value={chatDraft}
                                  onChange={event => setChatDraft(event.target.value)}
                                  placeholder={`Reply to ${inquiry.name}…`}
                                  maxLength={5000}
                                  rows={2}
                                  className="field min-h-12 flex-1 resize-y"
                                  aria-label={`Reply to ${inquiry.name}`}
                                />
                                <button type="submit" disabled={sendingReply || !chatDraft.trim()} className="btn btn-p self-end disabled:cursor-not-allowed disabled:opacity-50 sm:self-stretch">
                                  <Send size={16} /> {sendingReply ? 'Sending…' : 'Send reply'}
                                </button>
                              </form>
                            </div>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </section>
      {selectedUser && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05030c]/80 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeUserDetails()
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="user-details-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#100c20] p-5 text-white shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan">User details</p>
                <h2 id="user-details-title" className="mt-2 text-2xl font-black sm:text-3xl">Edit user profile</h2>
              </div>
              <button type="button" onClick={closeUserDetails} className="rounded-xl border border-white/15 p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close user details"><X size={20} /></button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <p className="text-sm"><span className="block text-xs font-semibold uppercase tracking-wider text-sky-100/50">Account type</span><span className="mt-1 inline-block capitalize">{selectedUser.role}</span></p>
              <p className="text-sm"><span className="block text-xs font-semibold uppercase tracking-wider text-sky-100/50">Joined</span><span className="mt-1 inline-block">{formatDate(selectedUser.created_at)}</span></p>
            </div>

            <ProfileEditor profile={selectedUser} onSaved={updateSelectedUser} buttonLabel="Save user profile" />

            <div className="mt-7">
              <h3 className="text-lg font-bold">Inquiries</h3>
              {userDetailsLoading ? (
                <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-sky-100/70">Loading inquiries…</p>
              ) : userDetailsError ? (
                <p role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-100">{userDetailsError}. Make sure the latest <code>project_inquiries.sql</code> has been run.</p>
              ) : userInquiries.length === 0 ? (
                <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-sky-100/70">There are no inquiries from this user.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {userInquiries.map(inquiry => (
                    <article key={inquiry.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-white">{inquiry.service || 'General inquiry'}</h4>
                        <span className="text-xs text-sky-100/55">{formatDate(inquiry.created_at)}</span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-sky-100/75 sm:grid-cols-2">
                        <p>Contact: {inquiry.name} · {inquiry.email}</p>
                        <p>Phone: {inquiry.phone || 'Not provided'}</p>
                        <p>Business: {inquiry.business_name || 'Not provided'}</p>
                        <p>Budget: {inquiry.budget || 'Not specified'} · Timeline: {inquiry.timeline || 'Not specified'}</p>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap rounded-xl bg-black/15 p-3 text-sm leading-relaxed text-sky-100/80">{inquiry.details || 'No project details provided.'}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-red-300/15 pt-6">
              <h3 className="font-bold text-red-100">Danger zone</h3>
              {selectedUser.role === 'user' && selectedUser.id !== session.user.id ? (
                <>
                  <p className="mt-2 text-sm text-sky-100/70">
                    Permanently remove this user account. Their inquiries stay in the dashboard without an account link; messages sent by this user are deleted.
                  </p>
                  <button
                    type="button"
                    onClick={deleteSelectedUser}
                    disabled={deletingUser}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 font-bold text-red-100 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    {deletingUser ? 'Deleting account…' : 'Permanently delete account'}
                  </button>
                </>
              ) : (
                <p className="mt-2 text-sm text-sky-100/70">Administrator accounts cannot be deleted from this panel.</p>
              )}
              {userDeleteError && <p role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">{userDeleteError}</p>}
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  )
}
