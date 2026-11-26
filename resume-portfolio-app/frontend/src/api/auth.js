/**
 * Authentication API client and token storage for ResumeCraft.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

const TOKEN_KEY = 'resumecraft_auth_token'
const USER_KEY = 'resumecraft_auth_user'
const REMEMBER_KEY = 'resumecraft_remember_me'

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setAuthToken(token, remember = true) {
  try {
    if (token) {
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token)
        sessionStorage.removeItem(TOKEN_KEY)
      } else {
        sessionStorage.setItem(TOKEN_KEY, token)
        localStorage.removeItem(TOKEN_KEY)
      }
    }
  } catch {}
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredUser(user, remember = true) {
  try {
    if (user) {
      const serialized = JSON.stringify(user)
      if (remember) {
        localStorage.setItem(USER_KEY, serialized)
        sessionStorage.removeItem(USER_KEY)
      } else {
        sessionStorage.setItem(USER_KEY, serialized)
        localStorage.removeItem(USER_KEY)
      }
    }
  } catch {}
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(USER_KEY)
  } catch {}
}

/**
 * Register a new user account.
 */
export async function registerUser({ fullName, email, password, confirmPassword }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, confirmPassword })
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Registration failed (HTTP ${res.status})`)
  }
  return data
}

/**
 * Login with email and password.
 */
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Invalid email or password.')
  }
  return data
}

/**
 * Verify current session and retrieve user data.
 */
export async function fetchCurrentUser(token) {
  const authToken = token || getAuthToken()
  if (!authToken) return null

  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken()
      clearStoredUser()
      return null
    }
    throw new Error(`Session verification failed: HTTP ${res.status}`)
  }

  const data = await res.json()
  return data.user
}

/**
 * Request password reset token.
 */
export async function requestPasswordReset(email) {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Failed to initiate password reset.')
  }
  return data
}

/**
 * Reset password using token.
 */
export async function resetPassword({ token, newPassword, confirmPassword }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword })
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset password.')
  }
  return data
}
