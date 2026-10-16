import { Facebook, Instagram, Mail, MessageCircle, Send, Linkedin } from 'lucide-react'
import { wa } from './wa.js'

const socialPlatforms = [
  {
    key: 'telegram',
    icon: Send,
    style: 'contact-option-icon--telegram',
  },
  {
    key: 'facebook',
    icon: Facebook,
    style: 'contact-option-icon--facebook',
  },
  {
    key: 'instagram',
    icon: Instagram,
    style: 'contact-option-icon--instagram',
  },
  {
    key: 'linkedin',
    icon: Linkedin,
    style: 'contact-option-icon--linkedin',
  },
]

function ContactOption({ name, detail, href, icon: Icon, style, newTab = false }) {
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      className="card flex min-w-0 items-center gap-4 !p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan/40"
    >
      <span className={`contact-option-icon ${style}`}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-bold">{name}</span>
        <span className="block truncate text-sm text-ink/70">{detail}</span>
      </span>
    </a>
  )
}

export function ContactOptions({ contactInfo, className = '' }) {
  return (
    <div className={`grid gap-3 ${className}`}>
      <ContactOption
        name="WhatsApp"
        detail="Fastest reply — chat with us directly"
        href={wa('', contactInfo.phone)}
        icon={MessageCircle}
        style="contact-option-icon--whatsapp"
        newTab
      />
      <ContactOption
        name="Email"
        detail={contactInfo.email}
        href={`mailto:${contactInfo.email}`}
        icon={Mail}
        style="contact-option-icon--email"
      />
      {socialPlatforms.map(platform => {
        const account = contactInfo.socials?.find(social => social.key === platform.key)
        if (!account) return null
        return (
          <ContactOption
            key={platform.key}
            name={account.name}
            detail={account.username}
            href={account.url}
            icon={platform.icon}
            style={platform.style}
            newTab
          />
        )
      })}
    </div>
  )
}
