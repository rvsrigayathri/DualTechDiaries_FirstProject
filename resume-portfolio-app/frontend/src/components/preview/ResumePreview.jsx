import { TEMPLATE_MAP, getTemplateById } from '../../registry/templateRegistry'

const PRIMARY_COLORS = [
  { hex: '#2457d6', label: 'Royal Blue' },
  { hex: '#1e3a8a', label: 'Executive Navy' },
  { hex: '#0d9488', label: 'Teal' },
  { hex: '#0284c7', label: 'Sky Blue' },
  { hex: '#7c3aed', label: 'Purple' },
  { hex: '#881337', label: 'Burgundy' },
  { hex: '#ec4899', label: 'Rose Pink' },
  { hex: '#f97316', label: 'Orange' },
  { hex: '#18181b', label: 'Monochrome Dark' }
]

const SECONDARY_COLORS = [
  { hex: '#0f172a', label: 'Slate Dark' },
  { hex: '#1e293b', label: 'Charcoal' },
  { hex: '#134e4a', label: 'Deep Teal' },
  { hex: '#312e81', label: 'Deep Indigo' },
  { hex: '#4c0519', label: 'Deep Wine' },
  { hex: '#27272a', label: 'Carbon' }
]

const FONTS = [
  { value: 'Inter', label: 'Inter (Modern Clean)' },
  { value: 'Georgia', label: 'Georgia (Editorial Serif)' },
  { value: 'Arial', label: 'Arial (Standard)' },
  { value: 'Roboto', label: 'Roboto (Tech Standard)' },
  { value: 'Merriweather', label: 'Merriweather (Academic)' }
]

const FONT_SIZES = [
  { value: 'small', label: 'Compact (10.5pt)' },
  { value: 'medium', label: 'Standard (11.5pt)' },
  { value: 'large', label: 'Readable (12.5pt)' }
]

const SPACINGS = [
  { value: 'compact', label: 'Tight / 1-Page' },
  { value: 'normal', label: 'Balanced' },
  { value: 'relaxed', label: 'Spacious' }
]

const ALL_SECTIONS = [
  { key: 'summary',         label: 'Summary' },
  { key: 'education',       label: 'Education' },
  { key: 'skills',          label: 'Skills' },
  { key: 'experience',      label: 'Experience' },
  { key: 'projects',        label: 'Projects' },
  { key: 'certifications',  label: 'Certifications' },
  { key: 'achievements',    label: 'Achievements' },
  { key: 'workshops',       label: 'Workshops' },
  { key: 'leadership',      label: 'Leadership' },
  { key: 'languages',       label: 'Languages' },
  { key: 'interests',       label: 'Interests' },
  { key: 'volunteer',       label: 'Volunteer' }
]

export default function ResumePreview({ data, onUpdateSettings }) {
  const settings = data?.settings || {}
  const templateId = settings.template || 'ats_professional'
  const Template = TEMPLATE_MAP[templateId] || TEMPLATE_MAP['ats_professional']
  const hidden = settings.hiddenSections || []

  const curTmplMeta = getTemplateById(templateId)
  const isAts = curTmplMeta?.isAts

  return (
    <div className="preview-panel" id="section-preview">
      {/* ── Customization Controls Toolbar ── */}
      <div className="preview-controls">
        {/* Row 1: Primary + Secondary Colors & Font */}
        <div className="preview-controls-row">
          <span className="preview-controls-label">Primary</span>
          <div className="color-swatches">
            {PRIMARY_COLORS.map(c => (
              <button
                key={c.hex}
                type="button"
                className={`color-swatch${settings.accentColor === c.hex ? ' active' : ''}`}
                style={{ background: c.hex }}
                title={c.label}
                onClick={() => onUpdateSettings('accentColor', c.hex)}
              />
            ))}
            <label className="color-custom-label" title="Pick custom hex color">
              <input
                type="color"
                className="color-custom-input"
                value={settings.accentColor || '#2457d6'}
                onChange={e => onUpdateSettings('accentColor', e.target.value)}
              />
              <span className="color-custom-icon">🎨</span>
            </label>
          </div>

          <span className="preview-controls-label" style={{ marginLeft: 8 }}>Secondary</span>
          <div className="color-swatches">
            {SECONDARY_COLORS.map(c => (
              <button
                key={c.hex}
                type="button"
                className={`color-swatch${settings.secondaryColor === c.hex ? ' active' : ''}`}
                style={{ background: c.hex }}
                title={c.label}
                onClick={() => onUpdateSettings('secondaryColor', c.hex)}
              />
            ))}
            <label className="color-custom-label" title="Pick custom secondary color">
              <input
                type="color"
                className="color-custom-input"
                value={settings.secondaryColor || '#0f172a'}
                onChange={e => onUpdateSettings('secondaryColor', e.target.value)}
              />
              <span className="color-custom-icon">🎨</span>
            </label>
          </div>
        </div>

        {/* Row 2: Typography, Size, Spacing & Layout */}
        <div className="preview-controls-row">
          <span className="preview-controls-label">Font</span>
          <select
            className="font-select"
            value={settings.fontFamily || 'Inter'}
            onChange={e => onUpdateSettings('fontFamily', e.target.value)}
          >
            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>

          <span className="preview-controls-label" style={{ marginLeft: 6 }}>Size</span>
          <select
            className="font-select"
            value={settings.fontSize || 'medium'}
            onChange={e => onUpdateSettings('fontSize', e.target.value)}
          >
            {FONT_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <span className="preview-controls-label" style={{ marginLeft: 6 }}>Spacing</span>
          <select
            className="font-select"
            value={settings.sectionSpacing || 'normal'}
            onChange={e => onUpdateSettings('sectionSpacing', e.target.value)}
          >
            {SPACINGS.map(sp => <option key={sp.value} value={sp.value}>{sp.label}</option>)}
          </select>

          {/* Sidebar position toggle where applicable */}
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            style={{ marginLeft: 'auto', fontSize: 11 }}
            title="Toggle sidebar alignment where supported"
            onClick={() => onUpdateSettings('sidebarPosition', settings.sidebarPosition === 'right' ? 'left' : 'right')}
          >
            ⇄ Sidebar: {settings.sidebarPosition === 'right' ? 'Right' : 'Left'}
          </button>
        </div>

        {/* Row 3: Section Visibility Toggles */}
        <div className="preview-controls-row">
          <span className="preview-controls-label">Sections</span>
          <div className="visibility-grid">
            {ALL_SECTIONS.map(s => {
              const isVisible = !hidden.includes(s.key)
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`visibility-pill${isVisible ? ' visible' : ''}`}
                  onClick={() => onUpdateSettings('hiddenSections',
                    isVisible
                      ? [...hidden, s.key]
                      : hidden.filter(k => k !== s.key)
                  )}
                  title={isVisible ? `Hide ${s.label}` : `Show ${s.label}`}
                >
                  <span>{isVisible ? '👁' : '🚫'}</span>
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Active Template Indicator Bar ── */}
      <div className="preview-template-banner">
        <span className="preview-tmpl-title">
          Active: <strong>{curTmplMeta?.label || templateId}</strong>
        </span>
        {isAts && <span className="rec-ats-pill" style={{ marginLeft: 8 }}>ATS-Friendly</span>}
        <span className="preview-tmpl-cat" style={{ marginLeft: 'auto' }}>
          Category: {curTmplMeta?.category || 'General'}
        </span>
      </div>

      {/* ── Live Resume Page ── */}
      {/* id="resume-page-source" is cloned by ActionBar for PDF printing */}
      <div className="preview-scroll">
        <div
          className={`resume-page font-${settings.fontSize || 'medium'} spacing-${settings.sectionSpacing || 'normal'}`}
          id="resume-page-source"
        >
          <Template
            data={data}
            accentColor={settings.accentColor || '#2457d6'}
            secondaryColor={settings.secondaryColor || '#0f172a'}
            fontFamily={settings.fontFamily || 'Inter'}
            fontSize={settings.fontSize || 'medium'}
            sectionSpacing={settings.sectionSpacing || 'normal'}
            sidebarPosition={settings.sidebarPosition || 'left'}
          />
        </div>
      </div>
    </div>
  )
}
