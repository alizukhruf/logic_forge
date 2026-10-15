import { SITE } from '../data.js'

export const wa = (text = '', phone = SITE.phone) => {
  const number = String(phone).replace(/\D/g, '')
  return `https://wa.me/${number}${text ? '?text=' + encodeURIComponent(text) : ''}`
}
