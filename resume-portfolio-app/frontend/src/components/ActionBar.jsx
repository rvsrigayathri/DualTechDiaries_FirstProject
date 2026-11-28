/**
 * Sticky bottom action bar.
 * Props:
 *   onSave     – () => void
 *   onPrint    – () => void   (unused – PDF handled here via DOM clone)
 *   onEdit     – () => void
 *   onReset    – () => void   (clear all resume data after confirm)
 *   saveToast  – boolean      (manual save toast)
 *   autoSaving – boolean      (debounced auto-save in progress)
 *   lastSaved  – string | null
 *   isValid    – boolean (enable/disable PDF)
 *   validationMessage – string | null (explanation when disabled)
 */
export default function ActionBar({ onSave, onPrint, onEdit, onReset, saveToast, autoSaving, lastSaved, isValid, validationMessage }) {
  const handlePrint = () => {
    onSave()  // persist before printing

    // Clone the live resume node to a direct <body> child so the print CSS
    // `body > *:not(#resume-print-target)` rule hides the app and shows only the resume.
    const resumeEl = document.getElementById('resume-page-source') || document.querySelector('.resume-page')
    if (!resumeEl) { window.print(); return }

    // Remove any old clone first
    const oldClone = document.getElementById('resume-print-target')
    if (oldClone) oldClone.remove()

    const clone = resumeEl.cloneNode(true)
    clone.id = 'resume-print-target'
    document.body.appendChild(clone)

    requestAnimationFrame(() => {
      window.print()
      const cleanup = () => { clone.remove(); window.removeEventListener('afterprint', cleanup) }
      window.addEventListener('afterprint', cleanup)
      setTimeout(cleanup, 3000)
    })
  }

  const handleReset = () => {
    if (window.confirm('Reset resume? This will clear all entered data and cannot be undone.')) {
      onReset()
    }
  }

  // Status label shown on the left of the bar
  const statusLabel = (() => {
    if (saveToast) return { icon: '✔', text: 'Saved!', cls: 'save-status-ok' }
    if (autoSaving) return { icon: '⏳', text: 'Saving…', cls: 'save-status-auto' }
    if (lastSaved)  return { icon: '🕐', text: `Saved at ${lastSaved}`, cls: 'save-status-time' }
    return null
  })()

  return (
    <div className="action-bar">
      <div className="action-bar-left">
        {statusLabel && (
          <span className={`save-status ${statusLabel.cls}`}>
            {statusLabel.icon} {statusLabel.text}
          </span>
        )}
      </div>

      <div className="action-bar-right">
        <button
          type="button"
          className="btn btn-ghost btn-danger-ghost"
          onClick={handleReset}
          title="Clear all resume data"
        >
          🗑 Reset
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onEdit}
          title="Scroll to top of form"
        >
          ✏️ Edit
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onSave}
        >
          💾 Save
        </button>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!isValid}
          onClick={isValid ? handlePrint : undefined}
          title={isValid ? 'Print or Save as PDF' : (validationMessage || 'Fill in name and valid email first')}
          aria-disabled={!isValid}
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  )
}
