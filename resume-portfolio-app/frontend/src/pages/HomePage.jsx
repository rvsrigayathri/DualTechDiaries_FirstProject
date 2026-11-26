import { useEffect, useRef, useState } from 'react'
import { fetchHealth } from '../api/health'
import { fetchResumeById } from '../api/resume'
import { useResumeStore } from '../hooks/useResumeStore'
import { useValidation } from '../hooks/useValidation'

import Layout from '../components/layout/Layout'
import ActionBar from '../components/ActionBar'

import PersonalInfo from '../components/sections/PersonalInfo'
import CareerObjective from '../components/sections/CareerObjective'
import Education from '../components/sections/Education'
import Skills from '../components/sections/Skills'
import Experience from '../components/sections/Experience'
import AdditionalSections from '../components/sections/AdditionalSections'
import TemplateSelector from '../components/TemplateSelector'
import ResumePreview from '../components/preview/ResumePreview'

const SECTION_IDS = [
  'personal', 'career', 'education', 'skills',
  'experience', 'additional', 'templates', 'preview'
]

export default function HomePage({ onGoDashboard, resumeIdToLoad, initialMobileTab }) {
  // ── Backend health ────────────────────────────────────────
  const [healthStatus, setHealthStatus] = useState('')
  const [healthLoading, setHealthLoading] = useState(true)
  const [healthError, setHealthError] = useState(false)

  useEffect(() => {
    fetchHealth()
      .then(d => { setHealthStatus(d.status); setHealthLoading(false) })
      .catch(() => { setHealthError(true); setHealthLoading(false) })
  }, [])

  // ── Resume store ──────────────────────────────────────────
  const store = useResumeStore()
  const { data, saveToast, autoSaving, lastSaved, saveDraft, clearDraft, loadResume } = store

  // Load specific resume if requested
  useEffect(() => {
    if (resumeIdToLoad) {
      fetchResumeById(resumeIdToLoad)
        .then(loaded => {
          if (loaded) loadResume(loaded)
        })
        .catch(err => console.warn('Failed to load resume by ID:', err))
    }
  }, [resumeIdToLoad])

  // ── Validation ────────────────────────────────────────────
  const { getError, touch, touchAll, isFormValid } = useValidation(data)

  // ── Active section (sidebar navigation) ──────────────────
  const [activeSection, setActiveSection] = useState('personal')
  const formRef = useRef(null)

  const navigateTo = (sectionId) => {
    setActiveSection(sectionId)
    const el = document.getElementById(`section-${sectionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleEdit = () => {
    setActiveSection('personal')
    // On mobile: switch back to form tab when "Edit" is clicked
    setMobileTab('form')
    formRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Mobile preview tab (shown on screens ≤ 1100px) ───────
  // 'form' | 'preview'
  const [mobileTab, setMobileTab] = useState(initialMobileTab || 'form')

  // ── Settings shorthand ────────────────────────────────────
  const updateSettings = (field, value) => store.updateSettings(field, value)

  return (
    <Layout
      activeSection={activeSection}
      onNavigate={navigateTo}
      onGoDashboard={onGoDashboard}
      healthProps={{ status: healthStatus, loading: healthLoading, error: healthError }}
    >
      {/* ── Mobile tab switcher (hidden on wide screens via CSS) ── */}
      <div className="mobile-tab-bar">
        <button
          className={`mobile-tab${mobileTab === 'form' ? ' active' : ''}`}
          onClick={() => setMobileTab('form')}
          type="button"
        >
          ✏️ Edit Form
        </button>
        <button
          className={`mobile-tab${mobileTab === 'preview' ? ' active' : ''}`}
          onClick={() => setMobileTab('preview')}
          type="button"
        >
          👁 Preview
        </button>
      </div>

      <div className="builder-columns">

        {/* ════ Left: Form column ════ */}
        <div
          className={`form-column${mobileTab === 'preview' ? ' mobile-hidden' : ''}`}
          ref={formRef}
        >
          <div className="form-column-inner">

            {/* Page header */}
            <div className="page-header">
              <h1>Build Your Resume</h1>
              <p>Fill in each section below — your resume preview updates live on the right.</p>
            </div>

            {/* 1. Personal Info */}
            <PersonalInfo
              personal={data.personal}
              onChange={(field, value) => store.updatePersonal(field, value)}
              getError={getError}
              onTouch={touch}
            />

            {/* 2. Career Objective */}
            <CareerObjective
              career={data.career}
              onChange={(field, value) => store.updateCareer(field, value)}
            />

            {/* 3. Education */}
            <Education
              education={data.education}
              onAdd={store.addEducation}
              onUpdate={store.updateEducation}
              onRemove={store.removeEducation}
            />

            {/* 4. Skills */}
            <Skills
              skills={data.skills}
              onAdd={store.addSkill}
              onRemove={store.removeSkill}
            />

            {/* 5. Experience */}
            <Experience
              experience={data.experience}
              onAdd={store.addExperience}
              onUpdate={store.updateExperience}
              onRemove={store.removeExperience}
            />

            {/* 6. Additional Sections */}
            <AdditionalSections
              projects={data.projects}
              certifications={data.certifications}
              achievements={data.achievements}
              workshops={data.workshops}
              leadership={data.leadership}
              languages={data.languages}
              interests={data.interests}
              volunteer={data.volunteer}
              addItem={store.addArrayItem}
              updateItem={store.updateArrayItem}
              removeItem={store.removeArrayItem}
              addInterest={store.addInterest}
              removeInterest={store.removeInterest}
            />

            {/* 7. Template Selector */}
            <TemplateSelector
              settings={data.settings}
              onUpdateSettings={updateSettings}
              resumeData={data}
            />

            {/* Bottom spacer for action bar */}
            <div style={{ height: 20 }} />

          </div>
        </div>

        {/* ════ Right: Live Preview ════ */}
        <div className={`preview-column${mobileTab === 'form' ? ' mobile-hidden' : ''}`}>
          <ResumePreview
            data={data}
            onUpdateSettings={updateSettings}
          />
        </div>

      </div>

      {/* ════ Sticky bottom action bar ════ */}
      <ActionBar
        onSave={saveDraft}
        onPrint={() => {}}
        onEdit={handleEdit}
        onReset={clearDraft}
        saveToast={saveToast}
        autoSaving={autoSaving}
        lastSaved={lastSaved}
        isValid={isFormValid}
      />
    </Layout>
  )
}
