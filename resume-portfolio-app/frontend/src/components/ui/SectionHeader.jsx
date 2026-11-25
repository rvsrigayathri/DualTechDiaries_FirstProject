/**
 * Reusable section header with optional Add button.
 * Props:
 *   step     – step number badge (string | number, optional)
 *   title    – string
 *   subtitle – string (optional)
 *   onAdd    – () => void (optional) — shows "+ Add …" button
 *   addLabel – string (default: 'Add')
 */
export default function SectionHeader({ step, title, subtitle, onAdd, addLabel = 'Add' }) {
  return (
    <div className="card-header" style={{ paddingBottom: 0 }}>
      <div className="card-header-left">
        {step != null && <div className="card-step">{step}</div>}
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      </div>
      {onAdd && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onAdd}>
          + {addLabel}
        </button>
      )}
    </div>
  )
}
