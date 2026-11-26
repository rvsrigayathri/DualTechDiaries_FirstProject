/**
 * API client for Backend Database Persistence.
 * Connects to Spring Boot /api/resume endpoints with automatic fallback.
 *
 * Configured via Vite environment variable VITE_API_BASE_URL.
 * - In local development: defaults to empty string '' (proxied by Vite to http://localhost:8080)
 * - In cloud production: set VITE_API_BASE_URL in Vercel project settings (e.g. https://resumecraft-backend.onrender.com)
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
const BACKEND_ID_KEY = 'resumecraft_backend_id'

export function getStoredBackendId() {
  try {
    const id = localStorage.getItem(BACKEND_ID_KEY)
    return id ? Number(id) : null
  } catch {
    return null
  }
}

export function setStoredBackendId(id) {
  try {
    if (id) {
      localStorage.setItem(BACKEND_ID_KEY, String(id))
    }
  } catch {}
}

export function clearStoredBackendId() {
  try {
    localStorage.removeItem(BACKEND_ID_KEY)
  } catch {}
}

export async function saveResumeToBackend(resumeData) {
  const personal = resumeData.personal || {}
  const career = resumeData.career || {}
  const settings = resumeData.settings || {}

  const existingId = resumeData._backendId || resumeData.id || getStoredBackendId()

  const payload = {
    id: existingId || null,
    fullName: personal.fullName || 'Untitled Resume',
    email: personal.email || '',
    desiredRole: career.desiredRole || '',
    targetTemplate: settings.template || 'ats_professional',
    resumeJson: JSON.stringify(resumeData)
  }

  const res = await fetch(`${API_BASE_URL}/api/resume/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    throw new Error(`Failed to save resume: HTTP ${res.status}`)
  }

  const result = await res.json()
  if (result && result.id) {
    setStoredBackendId(result.id)
  }
  return result
}

export async function fetchLatestResumeFromBackend() {
  const res = await fetch(`${API_BASE_URL}/api/resume/latest`)
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`HTTP ${res.status}`)
  }
  const data = await res.json()
  if (data && data.id) {
    setStoredBackendId(data.id)
  }
  if (data.resumeJson) {
    try {
      const parsed = JSON.parse(data.resumeJson)
      parsed._backendId = data.id
      return parsed
    } catch {
      return null
    }
  }
  return null
}

export async function fetchResumeById(id) {
  const res = await fetch(`${API_BASE_URL}/api/resume/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data && data.id) {
    setStoredBackendId(data.id)
  }
  if (data.resumeJson) {
    try {
      const parsed = JSON.parse(data.resumeJson)
      parsed._backendId = data.id
      return parsed
    } catch {
      return null
    }
  }
  return null
}

export async function fetchAllResumes() {
  const res = await fetch(`${API_BASE_URL}/api/resume/all`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}
