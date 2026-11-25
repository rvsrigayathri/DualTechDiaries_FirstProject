/**
 * API client for Backend Database Persistence.
 * Connects to Spring Boot /api/resume endpoints with automatic fallback.
 */

export async function saveResumeToBackend(resumeData) {
  const personal = resumeData.personal || {}
  const career = resumeData.career || {}
  const settings = resumeData.settings || {}

  const payload = {
    fullName: personal.fullName || 'Untitled Resume',
    email: personal.email || '',
    desiredRole: career.desiredRole || '',
    targetTemplate: settings.template || 'ats_professional',
    resumeJson: JSON.stringify(resumeData)
  }

  const res = await fetch('/api/resume/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    throw new Error(`Failed to save resume: HTTP ${res.status}`)
  }

  return await res.json()
}

export async function fetchLatestResumeFromBackend() {
  const res = await fetch('/api/resume/latest')
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`HTTP ${res.status}`)
  }
  const data = await res.json()
  if (data.resumeJson) {
    return JSON.parse(data.resumeJson)
  }
  return null
}

export async function fetchResumeById(id) {
  const res = await fetch(`/api/resume/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.resumeJson ? JSON.parse(data.resumeJson) : null
}

export async function fetchAllResumes() {
  const res = await fetch('/api/resume/all')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}
