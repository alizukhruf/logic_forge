export function normalizePhoneNumber(value) {
  const phone = String(value || '').trim()
  if (!phone) return ''
  if (!/^\+?[\d\s().-]+$/.test(phone)) {
    throw new Error('Enter a valid phone number using digits and standard phone punctuation.')
  }

  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) {
    throw new Error('Enter a phone number with 7 to 15 digits, including its country code.')
  }
  return digits
}
