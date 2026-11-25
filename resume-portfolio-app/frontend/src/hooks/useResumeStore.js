import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'resumecraft_draft_v2'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function defaultState() {
  return {
    personal: {
      fullName: '', email: '', phone: '', countryCode: '+91',
      location: '', photoUrl: '', linkedin: '', github: '', portfolio: ''
    },
    career: {
      category: 'fresher', desiredRole: '', objective: '', summary: ''
    },
    education: [{
      id: uid(), degree: '', specialization: '', institution: '',
      university: '', startYear: '', gradYear: '', cgpa: ''
    }],
    skills: {
      languages: [], frontend: [], backend: [],
      databases: [], tools: [], soft: []
    },
    experience: [{
      id: uid(), type: 'fresher', company: '', role: '', location: '',
      startDate: '', endDate: '', current: false, description: ''
    }],
    projects: [],
    certifications: [],
    achievements: [],
    workshops: [],
    leadership: [],
    languages: [],
    interests: [],
    volunteer: [],
    settings: {
      template: 'ats_professional',
      accentColor: '#2457d6',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter',
      fontSize: 'medium',
      sectionSpacing: 'normal',
      sidebarPosition: 'left',
      hiddenSections: []
    }
  }
}

export function useResumeStore() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Deep merge with defaults in case new keys were added
        const def = defaultState()
        return {
          ...def,
          ...parsed,
          settings: {
            ...def.settings,
            ...(parsed.settings || {})
          }
        }
      }
    } catch { /* ignore */ }
    return defaultState()
  })

  const [saveToast, setSaveToast] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [autoSaving, setAutoSaving] = useState(false)

  // ── Auto-save: debounced 2 s after every data change ──────
  const autoSaveTimerRef = useRef(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    // Skip the very first render (data just loaded from localStorage)
    if (isFirstRender.current) { isFirstRender.current = false; return }

    clearTimeout(autoSaveTimerRef.current)
    setAutoSaving(true)
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setLastSaved(t)
      } catch (e) {
        console.error('Auto-save failed', e)
      }
      setAutoSaving(false)
    }, 2000)

    return () => clearTimeout(autoSaveTimerRef.current)
  }, [data])

  // ── Personal ──────────────────────────────────────────────
  const updatePersonal = (field, value) =>
    setData(d => ({ ...d, personal: { ...d.personal, [field]: value } }))

  // ── Career ────────────────────────────────────────────────
  const updateCareer = (field, value) =>
    setData(d => ({ ...d, career: { ...d.career, [field]: value } }))

  // ── Education ─────────────────────────────────────────────
  const addEducation = () =>
    setData(d => ({
      ...d,
      education: [...d.education, {
        id: uid(), degree: '', specialization: '', institution: '',
        university: '', startYear: '', gradYear: '', cgpa: ''
      }]
    }))

  const updateEducation = (id, field, value) =>
    setData(d => ({
      ...d,
      education: d.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }))

  const removeEducation = (id) =>
    setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }))

  // ── Skills ────────────────────────────────────────────────
  const addSkill = (category, skill) => {
    const s = skill.trim()
    if (!s) return
    setData(d => {
      const existing = d.skills[category] || []
      if (existing.includes(s)) return d
      return { ...d, skills: { ...d.skills, [category]: [...existing, s] } }
    })
  }

  const removeSkill = (category, index) =>
    setData(d => ({
      ...d,
      skills: { ...d.skills, [category]: d.skills[category].filter((_, i) => i !== index) }
    }))

  // ── Experience ────────────────────────────────────────────
  const addExperience = () =>
    setData(d => ({
      ...d,
      experience: [...d.experience, {
        id: uid(), type: 'internship', company: '', role: '',
        location: '', startDate: '', endDate: '', current: false, description: ''
      }]
    }))

  const updateExperience = (id, field, value) =>
    setData(d => ({
      ...d,
      experience: d.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }))

  const removeExperience = (id) =>
    setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }))

  // ── Generic array sections (projects, certs, etc.) ────────
  const addArrayItem = (section, template) =>
    setData(d => ({ ...d, [section]: [...d[section], { id: uid(), ...template }] }))

  const updateArrayItem = (section, id, field, value) =>
    setData(d => ({
      ...d,
      [section]: d[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }))

  const removeArrayItem = (section, id) =>
    setData(d => ({ ...d, [section]: d[section].filter(item => item.id !== id) }))

  // ── Interests (simple string array) ──────────────────────
  const addInterest = (val) => {
    const v = val.trim()
    if (!v) return
    setData(d => ({ ...d, interests: [...d.interests, v] }))
  }
  const removeInterest = (index) =>
    setData(d => ({ ...d, interests: d.interests.filter((_, i) => i !== index) }))

  // ── Settings ──────────────────────────────────────────────
  const updateSettings = (field, value) =>
    setData(d => ({ ...d, settings: { ...d.settings, [field]: value } }))

  const toggleSection = (key) =>
    setData(d => {
      const hidden = d.settings.hiddenSections || []
      return {
        ...d,
        settings: {
          ...d.settings,
          hiddenSections: hidden.includes(key)
            ? hidden.filter(s => s !== key)
            : [...hidden, key]
        }
      }
    })

  // ── Persistence ───────────────────────────────────────────
  const saveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setLastSaved(t)
      setSaveToast(true)
      setTimeout(() => setSaveToast(false), 3000)
    } catch (e) {
      console.error('Save failed', e)
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultState())
  }

  return {
    data, lastSaved, saveToast, autoSaving,
    updatePersonal, updateCareer,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addExperience, updateExperience, removeExperience,
    addArrayItem, updateArrayItem, removeArrayItem,
    addInterest, removeInterest,
    updateSettings, toggleSection,
    saveDraft, clearDraft
  }
}
