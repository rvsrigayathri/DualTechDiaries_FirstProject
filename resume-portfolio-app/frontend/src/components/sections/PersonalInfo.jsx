import { useRef } from 'react'
import SectionHeader from '../ui/SectionHeader'

const COUNTRY_CODES = [
  '+91', '+1', '+44', '+61', '+971', '+65', '+49', '+33', '+81', '+86',
  '+7', '+55', '+27', '+234', '+92', '+880', '+94', '+977', '+60', '+62'
]

export default function PersonalInfo({ personal, onChange, getError, onTouch }) {
  const fileInputRef = useRef(null)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    // Compress image to max 300×300 px before storing as base64
    // This keeps localStorage usage small (< 50 KB instead of several MB)
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const MAX = 300
      let { width, height } = img
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height)
        width  = Math.round(width  * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
      onChange('photoUrl', dataUrl)
    }
    img.onerror = () => {
      // Fallback: read raw if canvas fails
      URL.revokeObjectURL(objectUrl)
      const reader = new FileReader()
      reader.onload = (ev) => onChange('photoUrl', ev.target.result)
      reader.readAsDataURL(file)
    }
    img.src = objectUrl
  }

  return (
    <div className="card" id="section-personal">
      <SectionHeader step="1" title="Personal Information" subtitle="Your contact and profile details" />
      <div className="card-body form-stack">

        {/* Profile Photo */}
        <div>
          <label className="field" style={{ marginBottom: 6, fontSize: 12.5, fontWeight: 600, display: 'block' }}>
            Profile Photo <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>(optional)</span>
          </label>
          <div
            className="photo-upload-row"
            onClick={() => fileInputRef.current?.click()}
          >
            {personal.photoUrl ? (
              <img src={personal.photoUrl} alt="Profile" className="photo-avatar" />
            ) : (
              <div className="photo-avatar-placeholder">👤</div>
            )}
            <div className="photo-upload-text">
              <div className="photo-upload-label">Click to upload photo</div>
              <div className="photo-upload-sub">JPG, PNG or WEBP · Max 2 MB</div>
            </div>
            {personal.photoUrl && (
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                style={{ marginLeft: 'auto' }}
                onClick={(e) => { e.stopPropagation(); onChange('photoUrl', '') }}
              >Remove</button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>

        {/* Full Name */}
        <div className="field">
          <label>Full Name <span className="required">*</span></label>
          <input
            type="text"
            value={personal.fullName}
            onChange={e => onChange('fullName', e.target.value)}
            onBlur={() => onTouch('fullName')}
            placeholder="e.g. Priya Sharma"
            className={getError('fullName') ? 'error' : ''}
          />
          {getError('fullName') && <div className="field-error">⚠ {getError('fullName')}</div>}
        </div>

        {/* Email */}
        <div className="field">
          <label>Email Address <span className="required">*</span></label>
          <input
            type="email"
            value={personal.email}
            onChange={e => onChange('email', e.target.value)}
            onBlur={() => onTouch('email')}
            placeholder="priya@example.com"
            className={getError('email') ? 'error' : ''}
          />
          {getError('email') && <div className="field-error">⚠ {getError('email')}</div>}
        </div>

        {/* Phone with country code */}
        <div className="field">
          <label>Phone Number</label>
          <div className="phone-row">
            <select
              className="country-code-select"
              style={{ width: 90, padding: '10px 8px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13.5, background: 'var(--surface)', outline: 'none', cursor: 'pointer' }}
              value={personal.countryCode}
              onChange={e => onChange('countryCode', e.target.value)}
            >
              {COUNTRY_CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <input
                type="tel"
                value={personal.phone}
                onChange={e => onChange('phone', e.target.value)}
                placeholder="98765 43210"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="field">
          <label>Location</label>
          <input
            type="text"
            value={personal.location}
            onChange={e => onChange('location', e.target.value)}
            placeholder="Chennai, Tamil Nadu"
          />
        </div>

        {/* Social links */}
        <div className="section-divider">
          <span className="section-divider-label">Online Profiles</span>
          <div className="section-divider-line" />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>LinkedIn URL</label>
            <input
              type="url"
              value={personal.linkedin}
              onChange={e => onChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/priya"
            />
          </div>
          <div className="field">
            <label>GitHub URL</label>
            <input
              type="url"
              value={personal.github}
              onChange={e => onChange('github', e.target.value)}
              placeholder="github.com/priya"
            />
          </div>
        </div>

        <div className="field">
          <label>Portfolio / Website URL</label>
          <input
            type="url"
            value={personal.portfolio}
            onChange={e => onChange('portfolio', e.target.value)}
            placeholder="https://priya.dev"
          />
        </div>

      </div>
    </div>
  )
}
