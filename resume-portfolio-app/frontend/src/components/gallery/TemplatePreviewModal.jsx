import { TEMPLATE_MAP } from '../../registry/templateRegistry'

/**
 * Modal dialog for inspecting any template rendered with the user's real resume data
 * before switching the active template.
 */
export default function TemplatePreviewModal({ template, resumeData, isOpen, onClose, onSelect }) {
  if (!isOpen || !template) return null

  const TemplateComponent = TEMPLATE_MAP[template.id] || TEMPLATE_MAP['ats_professional']
  const settings = resumeData?.settings || {}

  const handleApply = () => {
    onSelect(template.id)
    onClose()
  }

  return (
    <div className="template-modal-overlay" onClick={onClose}>
      <div className="template-modal-window" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="template-modal-header">
          <div className="template-modal-title-box">
            <h2 className="template-modal-title">{template.label}</h2>
            <span className="template-modal-badge">{template.badge}</span>
            {template.isAts && <span className="rec-ats-pill">100% ATS Compliant</span>}
          </div>
          <div className="template-modal-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleApply}
            >
              ✓ Use This Template
            </button>
            <button
              type="button"
              className="template-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Meta Bar */}
        <div className="template-modal-meta">
          <span><strong>Best For:</strong> {template.bestFor || 'All professions'}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 11.5 }}>
            Rendered with your live resume data
          </span>
        </div>

        {/* Modal Resume Preview Scroll Area */}
        <div className="template-modal-body">
          <div className="template-modal-page-wrapper">
            <div className={`resume-page font-${settings.fontSize || 'medium'} spacing-${settings.sectionSpacing || 'normal'}`}>
              <TemplateComponent
                data={resumeData}
                accentColor={settings.accentColor || template.accentDefault}
                secondaryColor={settings.secondaryColor || template.secondaryDefault}
                fontFamily={settings.fontFamily || template.fontDefault}
                fontSize={settings.fontSize || 'medium'}
                sectionSpacing={settings.sectionSpacing || 'normal'}
                sidebarPosition={settings.sidebarPosition || 'left'}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="template-modal-footer">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            Close Preview
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleApply}
          >
            Select &amp; Apply "{template.label}"
          </button>
        </div>
      </div>
    </div>
  )
}
