import { cleanUrl, ProfilePhoto } from './TemplateHelpers'

/**
 * Reusable Resume Header Component.
 * Supports multiple layouts:
 * - 'centered': Centered name, role, and inline contact bar (ATS, Academic, Executive).
 * - 'split': Name and title on left, contact items stacked on right (Developer, Engineering, Data Analyst).
 * - 'banner': Full-width colored gradient header (Creative, Marketing).
 * - 'classic': Traditional top-left aligned with optional right photo.
 */
export default function TemplateHeader({
  personal = {},
  career = {},
  variant = 'centered',
  showPhoto = true,
  photoShape = 'circle',
  accentColor,
  secondaryColor,
  className = ''
}) {
  const {
    fullName = 'Your Name',
    photoUrl,
    email,
    phone,
    countryCode = '+91',
    location,
    linkedin,
    github,
    portfolio
  } = personal

  const desiredRole = career?.desiredRole || ''
  const phoneFormatted = phone ? `${countryCode} ${phone}` : ''

  const contactList = [
    email && { icon: '✉', text: email, href: `mailto:${email}` },
    phoneFormatted && { icon: '📞', text: phoneFormatted },
    location && { icon: '📍', text: location },
    linkedin && { icon: '🔗', text: cleanUrl(linkedin), href: linkedin },
    github && { icon: '💻', text: cleanUrl(github), href: github },
    portfolio && { icon: '🌐', text: cleanUrl(portfolio), href: portfolio }
  ].filter(Boolean)

  if (variant === 'split') {
    return (
      <header className={`rt-shared-header header-split ${className}`}>
        <div className="rt-header-main" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {showPhoto && photoUrl && (
            <ProfilePhoto
              photoUrl={photoUrl}
              fullName={fullName}
              shape={photoShape}
              size={60}
              border={`2px solid ${accentColor || '#2457d6'}`}
            />
          )}
          <div>
            <h1 className="rt-header-name" style={accentColor ? { color: accentColor } : undefined}>
              {fullName}
            </h1>
            {desiredRole && <div className="rt-header-role">{desiredRole}</div>}
          </div>
        </div>
        <div className="rt-header-contact-stack">
          {contactList.map((item, i) => (
            <div key={i} className="rt-header-contact-item">
              <span className="rt-contact-icon">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </header>
    )
  }

  if (variant === 'banner') {
    return (
      <header
        className={`rt-shared-header header-banner ${className}`}
        style={{ background: `linear-gradient(135deg, ${secondaryColor || accentColor}, ${accentColor})` }}
      >
        <div className="rt-banner-inner" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {showPhoto && photoUrl ? (
            <ProfilePhoto
              photoUrl={photoUrl}
              fullName={fullName}
              shape={photoShape}
              size={64}
              border="2px solid rgba(255,255,255,0.6)"
            />
          ) : (
            <div className="rt-banner-avatar-fallback">👤</div>
          )}
          <div className="rt-banner-text">
            <h1 className="rt-banner-name">{fullName}</h1>
            {desiredRole && <div className="rt-banner-role">{desiredRole}</div>}
            <div className="rt-banner-contact">
              {contactList.map((item, i) => (
                <span key={i} className="rt-banner-contact-item">
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Default 'centered'
  return (
    <header className={`rt-shared-header header-centered ${className}`}>
      {showPhoto && photoUrl && (
        <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
          <ProfilePhoto
            photoUrl={photoUrl}
            fullName={fullName}
            shape={photoShape}
            size={64}
            border={`2px solid ${accentColor || '#374151'}`}
          />
        </div>
      )}
      <h1 className="rt-header-name" style={accentColor ? { color: accentColor } : undefined}>
        {fullName}
      </h1>
      {desiredRole && <div className="rt-header-role">{desiredRole}</div>}
      <div className="rt-header-contact-inline">
        {contactList.map((item, i) => (
          <span key={i} className="rt-contact-inline-item">
            {i > 0 && <span className="rt-contact-dot"> • </span>}
            {item.text}
          </span>
        ))}
      </div>
    </header>
  )
}
