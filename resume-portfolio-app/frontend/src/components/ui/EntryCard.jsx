import { useState } from 'react'

/**
 * Collapsible card for multi-entry sections (Education, Experience, Projects…)
 * Props:
 *   title      – display title (string)
 *   subtitle   – secondary info (string, optional)
 *   onRemove   – () => void
 *   defaultOpen – boolean (default: true when title is empty)
 *   children   – form fields inside the card body
 */
export default function EntryCard({ title, subtitle, onRemove, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen || !title)

  const displayTitle = title || 'New Entry'

  return (
    <div className="entry-card">
      <div className="entry-card-header" onClick={() => setOpen(o => !o)}>
        <div>
          <div className="entry-card-title">{displayTitle}</div>
          {subtitle && <div className="entry-card-meta">{subtitle}</div>}
        </div>
        <div className="entry-card-actions">
          <button
            type="button"
            className="btn-icon danger"
            title="Remove entry"
            onClick={(e) => { e.stopPropagation(); onRemove() }}
          >🗑</button>
          <button
            type="button"
            className="btn-icon"
            title={open ? 'Collapse' : 'Expand'}
            onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
          >
            {open ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {open && (
        <div className="entry-card-body">
          {children}
        </div>
      )}
    </div>
  )
}
