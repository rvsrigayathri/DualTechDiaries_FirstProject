import { useState, useMemo } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates resume personal info.
 * Handles null/undefined safety, empty strings, whitespace-only strings,
 * and valid email formatting.
 */
export function validatePersonalInfo(personal = {}) {
  const fullName = typeof personal?.fullName === 'string' ? personal.fullName.trim() : ''
  const email = typeof personal?.email === 'string' ? personal.email.trim() : ''

  const errors = {
    fullName: !fullName ? 'Full name is required' : null,
    email: !email
      ? 'Email is required'
      : !EMAIL_RE.test(email)
        ? 'Enter a valid email address'
        : null
  }

  const isValid = !errors.fullName && !errors.email

  // Explanatory message when invalid
  let validationMessage = ''
  if (errors.fullName && errors.email) {
    validationMessage = 'Please enter your Full Name and a valid Email Address to download PDF'
  } else if (errors.fullName) {
    validationMessage = 'Please enter your Full Name to download PDF'
  } else if (errors.email) {
    validationMessage = errors.email === 'Email is required'
      ? 'Please enter your Email Address to download PDF'
      : 'Please enter a valid Email Address (e.g. name@example.com) to download PDF'
  }

  return { errors, isValid, validationMessage }
}

export function useValidation(data) {
  const [touched, setTouched] = useState({})

  const touch = (field) => setTouched(t => ({ ...t, [field]: true }))

  // Always compute errors from the latest data.personal passed into the hook
  const { errors, isValid: isFormValid, validationMessage } = useMemo(() => {
    return validatePersonalInfo(data?.personal)
  }, [data?.personal?.fullName, data?.personal?.email])

  const getError = (field) => touched[field] ? errors[field] : null

  const touchAll = () =>
    setTouched({ fullName: true, email: true })

  return { getError, touch, touchAll, isFormValid, errors, validationMessage }
}
