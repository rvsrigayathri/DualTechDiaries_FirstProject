import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useValidation(data) {
  const [touched, setTouched] = useState({})

  const touch = (field) => setTouched(t => ({ ...t, [field]: true }))

  const errors = {
    fullName: !data.personal.fullName.trim() ? 'Full name is required' : null,
    email: !data.personal.email.trim()
      ? 'Email is required'
      : !EMAIL_RE.test(data.personal.email.trim())
        ? 'Enter a valid email address'
        : null
  }

  const getError = (field) => touched[field] ? errors[field] : null

  const isFormValid = !errors.fullName && !errors.email

  const touchAll = () =>
    setTouched({ fullName: true, email: true })

  return { getError, touch, touchAll, isFormValid }
}
