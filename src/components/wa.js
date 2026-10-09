import { SITE } from '../data.js'

export const wa = (text = '') => `https://wa.me/${SITE.phone}${text ? '?text=' + encodeURIComponent(text) : ''}`
