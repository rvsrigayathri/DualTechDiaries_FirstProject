import { useState, useMemo } from 'react'
import SectionHeader from './ui/SectionHeader'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../registry/templateRegistry'
import { recommendTemplates } from '../utils/templateRecommender'
import TemplatePreviewModal from './gallery/TemplatePreviewModal'

export default function TemplateSelector({ settings, onUpdateSettings, resumeData }) {
  const selected = settings?.template || 'ats_professional'
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalTemplate, setModalTemplate] = useState(null)

  // Compute smart recommendations based on real user resume data
  const recommendations = useMemo(() => {
    return recommendTemplates(resumeData)
  }, [resumeData])

  const recommendedMap = useMemo(() => {
    const map = new Map()
    recommendations.forEach(r => map.set(r.id, r))
    return map
  }, [recommendations])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => {
      // Category filter
      const matchesCat =
        activeCategory === 'all' ||
        t.category === activeCategory ||
        (activeCategory === 'ats' && t.isAts) ||
        (activeCategory === 'corporate' && (t.category === 'corporate' || t.category === 'executive'))

      // Search filter
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        t.label.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.badge.toLowerCase().includes(q) ||
        (t.bestFor && t.bestFor.toLowerCase().includes(q))

      return matchesCat && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const handleSelect = (templateId) => {
    onUpdateSettings('template', templateId)
    // On mobile, scroll to preview tab
    const previewEl = document.getElementById('section-preview')
    if (previewEl && window.innerWidth <= 1100) {
      previewEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="card" id="section-templates">
      <SectionHeader
        step="7"
        title="Resume Templates Collection"
        subtitle="12 professional templates tailored for every career path with smart layout recommendations"
      />

      <div className="card-body">
        {/* ── Smart Recommendations Section ── */}
        {recommendations.length > 0 && (
          <div className="recommendations-box">
            <div className="rec-box-header">
              <span className="rec-star">✨</span>
              <div>
                <div className="rec-box-title">Smart Recommendations for You</div>
                <div className="rec-box-subtitle">
                  Analyzed your career category, skills, and experience to pick the most effective layouts
                </div>
              </div>
            </div>

            <div className="rec-cards-grid">
              {recommendations.map(rec => {
                const tmpl = TEMPLATES.find(t => t.id === rec.id)
                if (!tmpl) return null
                const isCur = selected === tmpl.id
                return (
                  <div
                    key={rec.id}
                    className={`rec-card ${isCur ? 'active' : ''}`}
                    onClick={() => handleSelect(tmpl.id)}
                  >
                    <div className="rec-card-top">
                      <span className="rec-badge">★ Top Pick</span>
                      <span className="rec-match-score">{rec.matchPercent}% Match</span>
                      {tmpl.isAts && <span className="rec-ats-pill">ATS Safe</span>}
                    </div>
                    <div className="rec-card-name">{tmpl.label}</div>
                    <div className="rec-card-reason">💡 {rec.reason}</div>
                    <div className="rec-card-actions">
                      <button
                        type="button"
                        className={`btn btn-xs ${isCur ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1 }}
                        onClick={(e) => { e.stopPropagation(); handleSelect(tmpl.id) }}
                      >
                        {isCur ? '✓ Active' : 'Use Template'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        title="Preview with your resume data"
                        onClick={(e) => { e.stopPropagation(); setModalTemplate(tmpl) }}
                      >
                        👁️ Preview
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Search & Category Filter Bar ── */}
        <div className="gallery-toolbar">
          <div className="gallery-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by role, style, keywords (e.g. Developer, ATS, Executive)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="gallery-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="gallery-category-chips">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`gallery-cat-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Template Cards Grid ── */}
        <div className="gallery-grid">
          {filteredTemplates.map(t => {
            const isSelected = selected === t.id
            const recInfo = recommendedMap.get(t.id)

            return (
              <div
                key={t.id}
                className={`gallery-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(t.id)}
              >
                {/* Visual Thumbnail */}
                <div className="gallery-thumb-wrap">
                  <TemplateThumbnail templateId={t.id} />
                  {recInfo && (
                    <span className="gallery-thumb-rec-tag">★ {recInfo.matchPercent}% Match</span>
                  )}
                  {t.isAts && (
                    <span className="gallery-thumb-ats-tag">ATS Safe</span>
                  )}
                  {isSelected && (
                    <div className="gallery-thumb-selected-overlay">
                      <span className="sel-check">✓ Active Template</span>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="gallery-card-info">
                  <div className="gallery-card-header-row">
                    <div className="gallery-card-title">{t.label}</div>
                    <span className="gallery-card-badge">{t.badge}</span>
                  </div>
                  <div className="gallery-card-desc">{t.description}</div>
                  {t.bestFor && (
                    <div className="gallery-card-bestfor">
                      <strong>Best for: </strong>{t.bestFor}
                    </div>
                  )}

                  <div className="gallery-card-action-row">
                    <button
                      type="button"
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      onClick={(e) => { e.stopPropagation(); handleSelect(t.id) }}
                    >
                      {isSelected ? '✓ Selected' : 'Select Template'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      title="Preview this template with your real data"
                      onClick={(e) => { e.stopPropagation(); setModalTemplate(t) }}
                    >
                      👁️ Preview
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <p>No templates found matching "{searchQuery}".</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 8 }}
              onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Live Full Template Preview Modal ── */}
      <TemplatePreviewModal
        template={modalTemplate}
        resumeData={resumeData}
        isOpen={Boolean(modalTemplate)}
        onClose={() => setModalTemplate(null)}
        onSelect={handleSelect}
      />
    </div>
  )
}

/**
 * High-fidelity visual SVG/CSS mini thumbnail representation for each template.
 */
function TemplateThumbnail({ templateId }) {
  switch (templateId) {
    case 'ats_professional':
      return (
        <div className="tmpl-mini-ats">
          <div className="mini-line w-60 center bg-dark" />
          <div className="mini-line w-40 center bg-muted" />
          <div className="mini-rule" />
          <div className="mini-line w-80 bg-sub" />
          <div className="mini-line w-90" />
          <div className="mini-rule" />
          <div className="mini-line w-50 bg-sub" />
          <div className="mini-line w-75" />
        </div>
      )
    case 'modern_executive':
      return (
        <div className="tmpl-mini-split">
          <div className="mini-side bg-navy">
            <div className="mini-circle" />
            <div className="mini-sline w-70" />
            <div className="mini-sline w-50" />
            <div className="mini-sline w-80" />
          </div>
          <div className="mini-body">
            <div className="mini-line w-80 bg-blue" />
            <div className="mini-line w-90" />
            <div className="mini-line w-70" />
            <div style={{ height: 4 }} />
            <div className="mini-line w-80 bg-blue" />
            <div className="mini-line w-60" />
          </div>
        </div>
      )
    case 'creative_designer':
      return (
        <div className="tmpl-mini-creative">
          <div className="mini-banner bg-pink">
            <div className="mini-circle white" />
            <div className="mini-sline w-60" />
          </div>
          <div className="mini-grid-2">
            <div className="mini-col">
              <div className="mini-line w-90 bg-pink-light" />
              <div className="mini-line w-80" />
              <div className="mini-line w-70" />
            </div>
            <div className="mini-col">
              <div className="mini-line w-80 bg-pink-light" />
              <div className="mini-line w-60" />
            </div>
          </div>
        </div>
      )
    case 'software_developer':
      return (
        <div className="tmpl-mini-dev">
          <div className="mini-top-border bg-blue" />
          <div className="mini-p-pad">
            <div className="mini-line w-50 bg-blue" />
            <div className="mini-chips-row">
              <span className="mini-chip" /><span className="mini-chip" /><span className="mini-chip" />
            </div>
            <div className="mini-card-box">
              <div className="mini-line w-70" />
              <div className="mini-line w-90 bg-muted" />
            </div>
            <div className="mini-card-box">
              <div className="mini-line w-60" />
            </div>
          </div>
        </div>
      )
    case 'data_analyst':
      return (
        <div className="tmpl-mini-data">
          <div className="mini-p-pad">
            <div className="mini-line w-60 bg-teal" />
            <div className="mini-rule bg-teal" />
            <div className="mini-metric-grid">
              <div className="mini-metric-cell" />
              <div className="mini-metric-cell" />
            </div>
            <div className="mini-line w-85" />
            <div className="mini-line w-70" />
          </div>
        </div>
      )
    case 'academic_cv':
      return (
        <div className="tmpl-mini-academic">
          <div className="mini-line w-50 center bg-dark" />
          <div className="mini-line w-30 center bg-muted" />
          <div className="mini-rule double" />
          <div className="mini-line w-40 bg-dark" />
          <div className="mini-line w-90" />
          <div className="mini-line w-80" />
          <div className="mini-line w-40 bg-dark" style={{ marginTop: 4 }} />
          <div className="mini-line w-85" />
        </div>
      )
    case 'graduate_fresher':
      return (
        <div className="tmpl-mini-fresher">
          <div className="mini-bar bg-sky" />
          <div className="mini-p-pad">
            <div className="mini-line w-60 bg-sky" />
            <div className="mini-line w-40 bg-muted" />
            <div className="mini-line w-80 bg-sub" style={{ marginTop: 4 }} />
            <div className="mini-line w-90" />
            <div className="mini-chips-row">
              <span className="mini-chip" /><span className="mini-chip" />
            </div>
          </div>
        </div>
      )
    case 'senior_executive':
      return (
        <div className="tmpl-mini-exec">
          <div className="mini-line w-70 center bg-indigo" />
          <div className="mini-line w-40 center bg-muted" />
          <div className="mini-rule bg-indigo" />
          <div className="mini-p-pad">
            <div className="mini-line w-90" />
            <div className="mini-line w-80" />
            <div className="mini-metric-grid" style={{ marginTop: 4 }}>
              <div className="mini-metric-cell" />
              <div className="mini-metric-cell" />
            </div>
          </div>
        </div>
      )
    case 'marketing_professional':
      return (
        <div className="tmpl-mini-mkt">
          <div className="mini-banner bg-orange">
            <div className="mini-sline w-50" />
            <div className="mini-sline w-30" />
          </div>
          <div className="mini-p-pad">
            <div className="mini-line w-70 bg-orange" />
            <div className="mini-line w-90" />
            <div className="mini-chips-row">
              <span className="mini-chip" /><span className="mini-chip" /><span className="mini-chip" />
            </div>
          </div>
        </div>
      )
    case 'engineering_professional':
      return (
        <div className="tmpl-mini-eng">
          <div className="mini-left-bar bg-sky" />
          <div className="mini-p-pad" style={{ marginLeft: 6 }}>
            <div className="mini-line w-60 bg-sky" />
            <div className="mini-line w-40" />
            <div className="mini-line w-80" style={{ marginTop: 4 }} />
            <div className="mini-line w-90" />
          </div>
        </div>
      )
    case 'minimalist':
      return (
        <div className="tmpl-mini-minimal">
          <div className="mini-p-pad">
            <div className="mini-line w-40 bg-dark" />
            <div className="mini-line w-30 bg-muted" />
            <div style={{ height: 6 }} />
            <div className="mini-row-split">
              <div className="mini-side-col w-25 bg-muted" />
              <div className="mini-main-col w-70">
                <div className="mini-line w-90" />
                <div className="mini-line w-75" />
              </div>
            </div>
          </div>
        </div>
      )
    case 'premium_corporate':
    default:
      return (
        <div className="tmpl-mini-corp">
          <div className="mini-top-bar bg-rose" />
          <div className="mini-p-pad">
            <div className="mini-line w-60 center bg-dark" />
            <div className="mini-line w-40 center bg-muted" />
            <div className="mini-rule bg-rose" />
            <div className="mini-line w-80" />
            <div className="mini-line w-90" />
          </div>
        </div>
      )
  }
}
