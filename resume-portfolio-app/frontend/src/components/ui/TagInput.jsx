import { useState, useRef } from 'react'

/**
 * Reusable tag/chip input.
 * Props:
 *   tags      – string[]
 *   onAdd     – (tag: string) => void
 *   onRemove  – (index: number) => void
 *   placeholder – string
 *   limit     – max tags (optional)
 */
export default function TagInput({ tags = [], onAdd, onRemove, placeholder = 'Type and press Enter', limit }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const submit = () => {
    const val = input.trim()
    if (!val) return
    if (limit && tags.length >= limit) return
    onAdd(val)
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onRemove(tags.length - 1)
    }
  }

  return (
    <>
      <div
        className="tag-input-container"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span key={i} className="tag-chip">
            {tag}
            <button
              type="button"
              className="tag-chip-remove"
              onClick={(e) => { e.stopPropagation(); onRemove(i) }}
              title="Remove"
            >×</button>
          </span>
        ))}
        {(!limit || tags.length < limit) && (
          <input
            ref={inputRef}
            className="tag-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onBlur={submit}
            placeholder={tags.length === 0 ? placeholder : ''}
          />
        )}
      </div>
      <div className="tag-hint">Press Enter or comma to add</div>
    </>
  )
}
